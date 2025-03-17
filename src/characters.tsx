import { Character, EntityMap } from "./types";
import { entityMap } from "./utils";

export const adam: Character = { id: "adam", name: "👨 Adam" };

export const eve: Character = { id: "eve", name: "👩 Eve" };

export const characters: EntityMap<Character> = entityMap([adam, eve]);
