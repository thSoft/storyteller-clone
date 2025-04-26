import { NodeAttributes, RelationType, StoryState } from "../storyState";
import { Character } from "../types";

export function addRelation(
  state: StoryState,
  characterId1: string,
  type: RelationType,
  characterId2: string,
  undirected: boolean = false
) {
  if (undirected) {
    state.graph.addUndirectedEdge(characterId1, characterId2, { type });
  } else {
    state.graph.addDirectedEdge(characterId1, characterId2, { type });
  }
}

export function setState<AttributeName extends keyof NodeAttributes>(
  state: StoryState,
  characterId: string | undefined,
  name: AttributeName,
  value: NodeAttributes[AttributeName]
) {
  if (characterId) {
    state.graph.setNodeAttribute(characterId, name, value);
  }
}

export function setStates<AttributeName extends keyof NodeAttributes>(
  state: StoryState,
  characterIds: Array<string | undefined>,
  name: AttributeName,
  value: NodeAttributes[AttributeName]
) {
  characterIds.forEach((characterId) => {
    setState(state, characterId, name, value);
  });
}

export function getState<AttributeName extends keyof NodeAttributes>(
  state: StoryState,
  characterId: string,
  name: AttributeName
): NodeAttributes[AttributeName] {
  return state.graph.getNodeAttribute(characterId, name);
}

export function areRelated(
  state: StoryState,
  characterId1: string,
  type: RelationType,
  characterId2: string,
  undirected: boolean = false
) {
  if (undirected) {
    return state.graph.someUndirectedEdge(
      characterId1,
      characterId2,
      (_, edgeAttributes) => edgeAttributes.type === type
    );
  } else {
    return state.graph.someDirectedEdge(
      characterId1,
      characterId2,
      (_, edgeAttributes) => edgeAttributes.type === type
    );
  }
}

export function getCharacter(
  predicate: (character: Character, otherCharacter: Character | undefined) => boolean,
  character1: Character | undefined,
  character2?: Character
): [Character | undefined, Character | undefined] {
  if (character1 && predicate(character1, character2)) {
    return [character1, character2];
  } else if (character2 && predicate(character2, character1)) {
    return [character2, character1];
  }
  return [undefined, undefined];
}

export function getRelated(state: StoryState, characterId: string, type: RelationType): string[] {
  return state.graph
    .mapOutEdges(characterId, (_0, edgeAttributes, _1, target) => (edgeAttributes.type === type ? target : undefined))
    .filter((target) => target !== undefined);
}

export function handlePreconditions(
  state: StoryState,
  character1: Character,
  character2?: Character,
  options: { checkDeathWitnessing?: boolean; checkKidnap?: boolean } = {
    checkDeathWitnessing: true,
    checkKidnap: true,
  }
): boolean {
  const [deadCharacter, otherCharacter] = getCharacter(
    (character) => state.graph.getNodeAttributes(character.id).dead === true,
    character1,
    character2
  );
  if (deadCharacter) {
    state.event = `${deadCharacter.name} was dead.`;
    if (options.checkDeathWitnessing) {
      handleDeathWitnessing(state, deadCharacter, otherCharacter);
    }
    return true;
  }
  return false;
}

export function handleDeathWitnessing(
  state: StoryState,
  deadCharacter: Character | undefined,
  otherCharacter: Character | undefined
) {
  if (
    deadCharacter &&
    otherCharacter &&
    areRelated(state, deadCharacter.id, "loves", otherCharacter.id) &&
    !state.graph.getNodeAttributes(otherCharacter.id).dead &&
    !state.graph.getNodeAttributes(otherCharacter.id).heartbroken
  ) {
    state.graph.setNodeAttribute(otherCharacter.id, "heartbroken", true);
    state.event += ` ${otherCharacter.name} was heartbroken by the death of ${deadCharacter.name}.`;
  }
}

export function getEavesdropperId(state: StoryState): string | undefined {
  return state.graph.getAttribute("eavesdropperId");
}
