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
import { EdgeAttributes, GraphAttributes, NodeAttributes, RelationType, StoryState } from "./storyState";

// Private state reader functions

function getGlobalState<AttributeName extends keyof GraphAttributes>(
  state: StoryState,
  name: AttributeName,
  povCharacterId?: string
): GraphAttributes[AttributeName] {
  return getStoryGraph(state, povCharacterId).getAttribute(name);
}

export function resolveImpersonation(state: StoryState, characterId: string, condition: boolean = true): string {
  if (condition) {
    const impersonatedIds = getStoryGraph(state)
      .mapOutEdges(characterId, (_0, edgeAttributes, _1, target) =>
        edgeAttributes.type === "impersonates" ? target : undefined
      )
      .filter((target) => target !== undefined);
    return impersonatedIds.length > 0 ? impersonatedIds[0] : characterId;
  } else {
    return characterId;
  }
}

function getStoryGraph(state: StoryState, povCharacterId?: string): StoryState {
  return povCharacterId ? state.getNodeAttribute(povCharacterId, "believedStoryState") || state : state;
}

function getState<AttributeName extends keyof NodeAttributes>(
  state: StoryState,
  characterId: string,
  name: AttributeName,
  povCharacterId?: string
): NodeAttributes[AttributeName] {
  const resolvedCharacterId = resolveImpersonation(state, characterId, povCharacterId !== characterId);
  return getStoryGraph(state, povCharacterId).getNodeAttribute(resolvedCharacterId, name);
}

function areRelated(
  state: StoryState,
  characterId1: string,
  type: RelationType,
  characterId2: string,
  povCharacterId?: string
) {
  const resolvedCharacterId1 = resolveImpersonation(state, characterId1, povCharacterId !== characterId1);
  const resolvedCharacterId2 = resolveImpersonation(state, characterId2, povCharacterId !== characterId2);
  const storyGraph = getStoryGraph(state, povCharacterId);
  return storyGraph.someDirectedEdge(
    resolvedCharacterId1,
    resolvedCharacterId2,
    (_, edgeAttributes) => edgeAttributes.type === type
  );
}

function getRelated(state: StoryState, characterId: string, type: RelationType, povCharacterId?: string): string[] {
  const resolvedCharacterId = resolveImpersonation(state, characterId, povCharacterId !== characterId);
  return getStoryGraph(state, povCharacterId)
    .mapOutEdges(resolvedCharacterId, (_0, edgeAttributes, _1, target) =>
      edgeAttributes.type === type ? target : undefined
    )
    .filter((target) => target !== undefined);
}

function getRelatedBy(state: StoryState, characterId: string, type: RelationType, povCharacterId?: string): string[] {
  const resolvedCharacterId = resolveImpersonation(state, characterId, povCharacterId !== characterId);
  return getStoryGraph(state, povCharacterId)
    .mapInEdges(resolvedCharacterId, (_0, edgeAttributes, source) =>
      edgeAttributes.type === type ? source : undefined
    )
    .filter((source) => source !== undefined);
}

type SourceTarget = {
  source: string;
  target: string;
};

function getRelations(state: StoryState, type: RelationType, povCharacterId?: string): SourceTarget[] {
  return getStoryGraph(state, povCharacterId)
    .mapEdges((_, attributes, source, target) => (attributes.type === type ? { source, target } : undefined))
    .filter((edge) => edge !== undefined);
}

// Private state writer functions

function getGraphsToUpdate(
  state: StoryState,
  participantIds?: string[],
  onlyBelieved?: boolean
): [StoryState, boolean][] {
  const participantGraphs =
    participantIds
      ?.map((characterId) => {
        const believedState = state.getNodeAttribute(characterId, "believedStoryState");
        return believedState ? ([believedState, true] as [StoryState, boolean]) : null;
      })
      .filter((pair) => pair !== null) ?? [];
  return onlyBelieved ? participantGraphs : [[state, false], ...participantGraphs];
}

function setGlobalState<AttributeName extends keyof GraphAttributes>(
  state: StoryState,
  name: AttributeName,
  value: GraphAttributes[AttributeName],
  participantIds?: string[],
  onlyBelieved?: boolean
) {
  const resolvedValue =
    typeof value === "object" && "id" in value ? { id: resolveImpersonation(state, value.id) } : value;
  getGraphsToUpdate(state, participantIds, onlyBelieved).forEach(([s, isBelievedGraph]) => {
    s.setAttribute(name, isBelievedGraph ? (resolvedValue as GraphAttributes[AttributeName]) : value);
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
    const resolvedCharacterId = resolveImpersonation(state, characterId);
    getGraphsToUpdate(state, participantIds, onlyBelieved).forEach(([s, isBelievedGraph]) => {
      s.setNodeAttribute(isBelievedGraph ? resolvedCharacterId : characterId, name, value);
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
  const resolvedSourceId = resolveImpersonation(state, sourceId);
  const resolvedTargetId = resolveImpersonation(state, targetId);
  getGraphsToUpdate(state, participantIds, onlyBelieved).forEach(([s, isBelievedGraph]) => {
    s.addDirectedEdge(isBelievedGraph ? resolvedSourceId : sourceId, isBelievedGraph ? resolvedTargetId : targetId, {
      type,
    });
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
  const resolvedSourceId = resolveImpersonation(state, sourceId);
  const resolvedTargetId = resolveImpersonation(state, targetId);
  getGraphsToUpdate(state, participantIds, onlyBelieved).forEach(([s, isBelievedGraph]) => {
    s.forEachDirectedEdge(
      isBelievedGraph ? resolvedSourceId : sourceId,
      isBelievedGraph ? resolvedTargetId : targetId,
      removeEdge
    );
  });

  function removeEdge(edge: string, edgeAttributes: EdgeAttributes) {
    if (edgeAttributes.type === type) {
      state.dropEdge(edge);
    }
  }
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
  resolveImpersonation: (characterId: string) => string;
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
    resolveImpersonation: (characterId: string) => resolveImpersonation(state, characterId),
  };
}

export function getInitialStoryState(): StoryState {
  const state = new MultiDirectedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>();
  // Add all characters as nodes
  Object.keys(characters).forEach((characterId) => {
    state.addNode(characterId);
  });

  // Set initial public state
  const stateProxy = createStateProxy(state);

  // - Marcello family
  stateProxy.setState(donMarcello.id, "headOfFamily", true);
  stateProxy.setState(donMarcello.id, "doesNotKill", true);
  stateProxy.addRelation(donMarcello.id, "wantsToKill", alessio.id);
  stateProxy.addRelation(vincenzo.id, "obeys", donMarcello.id);
  stateProxy.setState(donMarcello.id, "successors", [nico, vincenzo, lucia]);
  stateProxy.addRelation(nico.id, "childOf", donMarcello.id);
  stateProxy.addRelation(lucia.id, "childOf", donMarcello.id);
  stateProxy.setState(lucia.id, "sex", "female");

  // - Romano family
  stateProxy.setState(donRomano.id, "headOfFamily", true);
  stateProxy.setState(donRomano.id, "doesNotSteal", true);
  stateProxy.setState(donRomano.id, "doesNotKill", true);
  stateProxy.setState(donRomano.id, "knowsSecretCode", true);
  stateProxy.addRelation(bruno.id, "obeys", donRomano.id);
  stateProxy.addRelation(alessio.id, "obeys", donRomano.id);
  stateProxy.addRelation(alessio.id, "childOf", donRomano.id);

  // - Police
  stateProxy.setState(inspectorRinaldi.id, "worksForPolice", true);

  // Set each character's believedStoryState to a copy of the initial public story state
  const initialState = state.copy();
  Object.keys(characters).forEach((characterId) => {
    stateProxy.setState(characterId, "believedStoryState", initialState.copy());
  });

  // Set initial secret state
  stateProxy.setGlobalState("gunOwner", donMarcello);

  return state;
}
