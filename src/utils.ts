import { characters } from "./characters";
import { Entity, EntityMap } from "./types";

export function entityMap<T extends Entity>(items: T[]): EntityMap<T> {
  const result = Object.fromEntries(items.map((item) => [item.id, item]));
  if (Object.keys(result).length !== items.length) {
    throw new Error("Duplicate entity IDs found.");
  }
  return result;
}

export function resolve<T extends Entity>(
  ids: string[],
  map: EntityMap<T>
): T[] {
  return ids.map((id) => map[id]);
}

export function areRelated(
  relationshipMap: Record<string, string>,
  characterId1: string,
  characterId2: string
) {
  return (
    relationshipMap[characterId1] === characterId2 ||
    relationshipMap[characterId2] === characterId1
  );
}
export function resolveMap(slotAssignedCharacters: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(slotAssignedCharacters).map(([slotId, characterId]) => [
      slotId,
      characters[characterId],
    ])
  );
}
