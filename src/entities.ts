export type Entity = { id: string };

export type EntityMap<T extends Entity> = Record<string, T>;

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
