import { CharacterPair, CharacterState, Entity, EntityMap } from "./types";

export function entityMap<T extends Entity>(items: T[]): EntityMap<T> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

const createPair = (char1: string, char2: string): CharacterPair =>
  [char1, char2].sort() as CharacterPair;
export const hasPair = (
  relationships: Set<CharacterPair>,
  char1: string,
  char2: string
) =>
  [...relationships].some(
    ([a, b]) => (a === char1 && b === char2) || (a === char2 && b === char1)
  );
export const addPair = (
  relationships: Set<CharacterPair>,
  char1: string,
  char2: string
) => new Set([...relationships, createPair(char1, char2)]);
export const addCharacterState = (
  stateMap: Record<string, Set<CharacterState>>,
  characterId: string,
  state: CharacterState
): Record<string, Set<CharacterState>> => {
  const newStateMap = { ...stateMap };
  if (!newStateMap[characterId]) {
    newStateMap[characterId] = new Set();
  }
  newStateMap[characterId].add(state);
  return newStateMap;
};
