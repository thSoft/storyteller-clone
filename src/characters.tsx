import { Character, EntityMap } from "./types";
import { entityMap } from "./utils";

// Characters

export const characters: EntityMap<Character> = entityMap([
  { id: "adam", name: "👨 Adam" },
  { id: "eve", name: "👩 Eve" },
]);
