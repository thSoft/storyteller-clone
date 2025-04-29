import { Entity, EntityMap } from "./types";

export function entityMap<T extends Entity>(items: T[]): EntityMap<T> {
  const result = Object.fromEntries(items.map((item) => [item.id, item]));
  if (Object.keys(result).length !== items.length) {
    throw new Error("Duplicate entity IDs found.");
  }
  return result;
}

export function resolve<T extends Entity>(ids: string[], map: EntityMap<T>): T[] {
  return ids.map((id) => map[id]);
}

export function toFirstUpper(string: string | undefined): string {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}
