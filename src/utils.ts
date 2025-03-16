import { CharacterPair, CharacterState, Entity, EntityMap } from "./types";

export function entityMap<T extends Entity>(items: T[]): EntityMap<T> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

export function resolve<T extends Entity>(
  ids: string[],
  map: EntityMap<T>
): T[] {
  return ids.map((id) => map[id]);
}

function createPair(char1: string, char2: string): CharacterPair {
  return [char1, char2].sort() as CharacterPair;
}

export function hasPair(
  relationships: Set<CharacterPair>,
  char1: string,
  char2: string
) {
  return [...relationships].some(
    ([a, b]) => (a === char1 && b === char2) || (a === char2 && b === char1)
  );
}

export function addPair(
  relationships: Set<CharacterPair>,
  char1: string,
  char2: string
) {
  return new Set([...relationships, createPair(char1, char2)]);
}

export function addCharacterState(
  stateMap: Record<string, Set<CharacterState>>,
  characterId: string,
  state: CharacterState
): Record<string, Set<CharacterState>> {
  const newStateMap = { ...stateMap };
  if (!newStateMap[characterId]) {
    newStateMap[characterId] = new Set();
  }
  newStateMap[characterId].add(state);
  return newStateMap;
}
