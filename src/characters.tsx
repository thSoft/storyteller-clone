import { Character, EntityMap } from "./types";
import { entityMap } from "./utils";

export const adam: Character = { id: "adam", name: "👨 Adam" };

export const eve: Character = { id: "eve", name: "👩 Eve" };

export const firebird: Character = { id: "firebird", name: "🔥 The Firebird" };

export const jackFrost: Character = { id: "jackFrost", name: "❄️ Jack Frost" };

export const neptune: Character = { id: "neptune", name: "💧 Neptune" };

export const characters: EntityMap<Character> = entityMap([
  adam,
  eve,
  firebird,
  jackFrost,
  neptune,
]);
