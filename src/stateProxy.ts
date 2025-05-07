import { MultiDirectedGraph } from "graphology";
import {
  alessio,
  bruno,
  characters,
  donMarcello,
  donRomano,
  inspectorRinaldi,
  lucia,
  nico,
  vincenzo,
} from "./characters";
import {
  Action,
  EdgeAttributes,
  GraphAttributes,
  initialEvent,
  NodeAttributes,
  RelationType,
  StoryState,
} from "./storyState";

// Private state reader functions

function getGlobalState<AttributeName extends keyof GraphAttributes>(
  state: StoryState,
  name: AttributeName,
  povCharacterId?: string
): GraphAttributes[AttributeName] {
  return getStoryState(state, povCharacterId).getAttribute(name);
}

export function resolveImpersonation(state: StoryState, characterId: string, condition: boolean = true): string {
  if (condition) {
    const impersonatedIds = getStoryState(state)
      .mapOutEdges(characterId, (_0, edgeAttributes, _1, target) =>
        edgeAttributes.type === "impersonates" ? target : undefined
      )
      .filter((target) => target !== undefined);
    return impersonatedIds.length > 0 ? impersonatedIds[0] : characterId;
  } else {
    return characterId;
  }
}

function getStoryState(state: StoryState, povCharacterId?: string): StoryState {
  return povCharacterId ? state.getNodeAttribute(povCharacterId, "believedStoryState") || state : state;
}

function getState<AttributeName extends keyof NodeAttributes>(
  state: StoryState,
  characterId: string,
  name: AttributeName,
  povCharacterId?: string
): NodeAttributes[AttributeName] {
  const resolvedCharacterId = resolveImpersonation(
    state,
    characterId,
    povCharacterId !== undefined && povCharacterId !== characterId
  );
  return getStoryState(state, povCharacterId).getNodeAttribute(resolvedCharacterId, name);
}

function getCharacterIds(
  state: StoryState,
  predicate: (characterId: string, attributes: NodeAttributes) => boolean,
  povCharacterId?: string
): string[] {
  return getStoryState(state, povCharacterId).filterNodes((characterId, attributes) =>
    predicate(characterId, attributes)
  );
}

function areRelated(
  state: StoryState,
  characterId1: string,
  type: RelationType,
  characterId2: string,
  povCharacterId?: string
) {
  const resolvedCharacterId1 = resolveImpersonation(
    state,
    characterId1,
    povCharacterId !== undefined && povCharacterId !== characterId1
  );
  const resolvedCharacterId2 = resolveImpersonation(
    state,
    characterId2,
    povCharacterId !== undefined && povCharacterId !== characterId2
  );
  const storyGraph = getStoryState(state, povCharacterId);
  return storyGraph.someDirectedEdge(
    resolvedCharacterId1,
    resolvedCharacterId2,
    (_, edgeAttributes) => edgeAttributes.type === type
  );
}

function getRelated(state: StoryState, characterId: string, type: RelationType, povCharacterId?: string): string[] {
  const resolvedCharacterId = resolveImpersonation(
    state,
    characterId,
    povCharacterId !== undefined && povCharacterId !== characterId
  );
  return getStoryState(state, povCharacterId)
    .mapOutEdges(resolvedCharacterId, (_0, edgeAttributes, _1, target) =>
      edgeAttributes.type === type
        ? resolveImpersonation(state, target, povCharacterId !== undefined && povCharacterId !== target)
        : undefined
    )
    .filter((target) => target !== undefined);
}

function getRelatedBy(state: StoryState, characterId: string, type: RelationType, povCharacterId?: string): string[] {
  const resolvedCharacterId = resolveImpersonation(
    state,
    characterId,
    povCharacterId !== undefined && povCharacterId !== characterId
  );
  return getStoryState(state, povCharacterId)
    .mapInEdges(resolvedCharacterId, (_0, edgeAttributes, source) =>
      edgeAttributes.type === type
        ? resolveImpersonation(state, source, povCharacterId !== undefined && povCharacterId !== source)
        : undefined
    )
    .filter((source) => source !== undefined);
}

type SourceTarget = {
  source: string;
  target: string;
};

function getRelations(state: StoryState, type: RelationType, povCharacterId?: string): SourceTarget[] {
  return getStoryState(state, povCharacterId)
    .mapEdges((_, attributes, source, target) => {
      if (attributes.type !== type) {
        return undefined;
      }
      const resolvedSource = resolveImpersonation(
        state,
        source,
        povCharacterId !== undefined && povCharacterId !== source
      );
      const resolvedTarget = resolveImpersonation(
        state,
        target,
        povCharacterId !== undefined && povCharacterId !== target
      );
      return { source: resolvedSource, target: resolvedTarget };
    })
    .filter((edge) => edge !== undefined);
}

// Private state writer functions

type StateToUpdate = {
  state: StoryState;
  believedBy?: string;
};

function getStatesToUpdate(state: StoryState, participantIds?: string[], onlyBelieved?: boolean): StateToUpdate[] {
  const participantGraphs =
    participantIds
      ?.map((characterId) => {
        const believedState = state.getNodeAttribute(characterId, "believedStoryState");
        return believedState ? { state: believedState, believedBy: characterId } : undefined;
      })
      .filter((stateToUpdate) => stateToUpdate !== undefined) ?? [];
  return onlyBelieved ? participantGraphs : [{ state }, ...participantGraphs];
}

function setGlobalState<AttributeName extends keyof GraphAttributes>(
  state: StoryState,
  name: AttributeName,
  value: GraphAttributes[AttributeName],
  participantIds?: string[],
  onlyBelieved?: boolean
) {
  // Important: We need to resolve the impersonation before setting the global state
  const valueId = typeof value === "object" && "id" in value ? value.id : undefined;
  const resolvedValue = valueId
    ? ({ id: resolveImpersonation(state, valueId) } as GraphAttributes[AttributeName])
    : value;
  getStatesToUpdate(state, participantIds, onlyBelieved).forEach(({ state: otherState, believedBy }) => {
    const valueToUse =
      believedBy !== undefined && valueId !== undefined && believedBy !== valueId ? resolvedValue : value;
    otherState.setAttribute(name, valueToUse);
  });
}

function setState<AttributeName extends keyof NodeAttributes>(
  state: StoryState,
  characterId: string | undefined,
  name: AttributeName,
  value: NodeAttributes[AttributeName],
  participantIds?: string[],
  onlyBelieved?: boolean
) {
  if (characterId !== undefined) {
    // Important: We need to resolve the impersonation before setting the state
    const resolvedCharacterId = resolveImpersonation(state, characterId);
    getStatesToUpdate(state, participantIds, onlyBelieved).forEach(({ state: otherState, believedBy }) => {
      const characterIdToUse =
        believedBy !== undefined && believedBy !== characterId ? resolvedCharacterId : characterId;
      otherState.setNodeAttribute(characterIdToUse, name, value);
    });
  }
}

function setStates<AttributeName extends keyof NodeAttributes>(
  state: StoryState,
  characterIds: Array<string | undefined>,
  name: AttributeName,
  value: NodeAttributes[AttributeName],
  participantIds?: string[],
  onlyBelieved?: boolean
) {
  characterIds.forEach((characterId) => {
    setState(state, characterId, name, value, participantIds, onlyBelieved);
  });
}

function addRelation(
  state: StoryState,
  sourceId: string,
  type: RelationType,
  targetId: string,
  participantIds?: string[],
  onlyBelieved?: boolean
) {
  // Important: We need to resolve the impersonation before adding the edge
  const resolvedSourceId = resolveImpersonation(state, sourceId);
  const resolvedTargetId = resolveImpersonation(state, targetId);
  getStatesToUpdate(state, participantIds, onlyBelieved).forEach(({ state: otherState, believedBy }) => {
    const edgeSourceId = believedBy !== undefined && believedBy !== sourceId ? resolvedSourceId : sourceId;
    const edgeTargetId = believedBy !== undefined && believedBy !== targetId ? resolvedTargetId : targetId;
    otherState.addDirectedEdge(edgeSourceId, edgeTargetId, { type });
  });
}

function removeRelation(
  state: StoryState,
  sourceId: string,
  type: RelationType,
  targetId: string,
  participantIds?: string[],
  onlyBelieved?: boolean
) {
  // Important: We need to resolve the impersonation before removing the edge
  const resolvedSourceId = resolveImpersonation(state, sourceId);
  const resolvedTargetId = resolveImpersonation(state, targetId);
  getStatesToUpdate(state, participantIds, onlyBelieved).forEach(({ state: otherState, believedBy }) => {
    const edgeSourceId = believedBy !== undefined && believedBy !== sourceId ? resolvedSourceId : sourceId;
    const edgeTargetId = believedBy !== undefined && believedBy !== targetId ? resolvedTargetId : targetId;
    otherState.forEachDirectedEdge(edgeSourceId, edgeTargetId, (edge, edgeAttributes) => {
      if (edgeAttributes.type === type) {
        otherState.dropEdge(edge);
      }
    });
  });
}

export type StateProxy = {
  getState: <AttributeName extends keyof NodeAttributes>(
    characterId: string,
    name: AttributeName,
    povCharacterId?: string
  ) => NodeAttributes[AttributeName];
  getGlobalState: <AttributeName extends keyof GraphAttributes>(
    name: AttributeName,
    povCharacterId?: string
  ) => GraphAttributes[AttributeName];
  setState: <AttributeName extends keyof NodeAttributes>(
    characterId: string | undefined,
    name: AttributeName,
    value: NodeAttributes[AttributeName],
    onlyBelieved?: boolean
  ) => void;
  setStates: <AttributeName extends keyof NodeAttributes>(
    characterIds: Array<string | undefined>,
    name: AttributeName,
    value: NodeAttributes[AttributeName],
    onlyBelieved?: boolean
  ) => void;
  setGlobalState: <AttributeName extends keyof GraphAttributes>(
    name: AttributeName,
    value: GraphAttributes[AttributeName],
    onlyBelieved?: boolean
  ) => void;
  addRelation: (characterId1: string, type: RelationType, characterId2: string, onlyBelieved?: boolean) => void;
  removeRelation: (characterId1: string, type: RelationType, characterId2: string, onlyBelieved?: boolean) => void;
  areRelated: (characterId1: string, type: RelationType, characterId2: string, povCharacterId?: string) => boolean;
  getRelated: (characterId: string, type: RelationType, povCharacterId?: string) => string[];
  getRelatedBy: (characterId: string, type: RelationType, povCharacterId?: string) => string[];
  getRelations: (type: RelationType, povCharacterId?: string) => SourceTarget[];
  getCharacterIds: (
    predicate: (characterId: string, attributes: NodeAttributes) => boolean,
    povCharacterId?: string
  ) => string[];
  resolveImpersonation: (characterId: string) => string;
  setDescription: (description: string) => void;
  addAction: (action: Action) => void;
  think(characterId: string, message: string): void;
  say(characterId: string, message: string): void;
  act(characterId: string, action: string): void;
};

export function createStateProxy(state: StoryState, participantIds?: string[]): StateProxy {
  return {
    getState: (characterId, name, povCharacterId) => getState(state, characterId, name, povCharacterId),
    getGlobalState: (name, povCharacterId) => getGlobalState(state, name, povCharacterId),
    setState: (characterId, name, value, onlyBelieved) =>
      setState(state, characterId, name, value, participantIds, onlyBelieved),
    setStates: (characterIds, name, value, onlyBelieved) =>
      setStates(state, characterIds, name, value, participantIds, onlyBelieved),
    setGlobalState: (name, value, onlyBelieved) => setGlobalState(state, name, value, participantIds, onlyBelieved),
    addRelation: (characterId1, type, characterId2, onlyBelieved) =>
      addRelation(state, characterId1, type, characterId2, participantIds, onlyBelieved),
    removeRelation: (characterId1, type, characterId2, onlyBelieved) =>
      removeRelation(state, characterId1, type, characterId2, participantIds, onlyBelieved),
    areRelated: (characterId1, type, characterId2, povCharacterId) =>
      areRelated(state, characterId1, type, characterId2, povCharacterId),
    getRelated: (characterId, type, povCharacterId) => getRelated(state, characterId, type, povCharacterId),
    getRelatedBy: (characterId, type, povCharacterId) => getRelatedBy(state, characterId, type, povCharacterId),
    getRelations: (type, povCharacterId) => getRelations(state, type, povCharacterId),
    getCharacterIds: (predicate, povCharacterId) => getCharacterIds(state, predicate, povCharacterId),
    resolveImpersonation: (characterId: string) => resolveImpersonation(state, characterId),
    setDescription: (description: string) => setDescription(state, description),
    addAction: (action: Action) => addAction(state, action),
    think: (characterId: string, message: string) => addAction(state, { type: "thought", characterId, message }),
    say: (characterId: string, message: string) => addAction(state, { type: "speech", characterId, message }),
    act: (characterId: string, action: string) => addAction(state, { type: "other", characterId, action }),
  };
}

function addAction(state: StoryState, action: Action) {
  const event = state.getAttribute("event") || initialEvent;
  state.setAttribute("event", { ...event, actions: [...event.actions, action] });
}

function setDescription(state: StoryState, description: string) {
  state.setAttribute("event", { ...(state.getAttribute("event") || initialEvent), description });
}

export function getInitialStoryState(): StoryState {
  const result = new MultiDirectedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>();
  // Add all characters as nodes
  Object.keys(characters).forEach((characterId) => {
    result.addNode(characterId);
  });

  // Set initial public state
  const state = createStateProxy(result);

  // - Marcello family
  state.setState(donMarcello.id, "headOfFamily", true);
  state.setState(donMarcello.id, "doesNotKill", true);
  state.addRelation(donMarcello.id, "wantsToKill", alessio.id);
  state.addRelation(vincenzo.id, "obeys", donMarcello.id);
  state.setState(donMarcello.id, "successors", [nico, vincenzo, lucia]);
  state.addRelation(nico.id, "childOf", donMarcello.id);
  state.addRelation(lucia.id, "childOf", donMarcello.id);
  state.setState(lucia.id, "sex", "female");

  // - Romano family
  state.setState(donRomano.id, "headOfFamily", true);
  state.setState(donRomano.id, "doesNotSteal", true);
  state.setState(donRomano.id, "doesNotKill", true);
  state.setState(donRomano.id, "knowsSecretCode", true);
  state.addRelation(bruno.id, "obeys", donRomano.id);
  state.addRelation(alessio.id, "obeys", donRomano.id);
  state.addRelation(alessio.id, "childOf", donRomano.id);

  // - Police
  state.setState(inspectorRinaldi.id, "worksForPolice", true);

  // Set each character's believedStoryState to a copy of the initial public story state
  const publicState = result.copy();
  Object.keys(characters).forEach((characterId) => {
    state.setState(characterId, "believedStoryState", publicState.copy());
  });

  // Set initial secret state
  state.setGlobalState("gunOwner", donMarcello);

  return result;
}
