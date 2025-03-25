import { Character, EntityMap } from "./types";
import { entityMap } from "./utils";

export const firebird: Character = { id: "firebird", name: "🔥 The Firebird" };

export const jackFrost: Character = { id: "jackFrost", name: "❄️ Jack Frost" };

export const neptune: Character = { id: "neptune", name: "💧 Neptune" };

export const knight: Character = { id: "knight", name: "🏇 Knight" };

export const princess: Character = { id: "princess", name: "👸 Princess" };

export const dragon: Character = { id: "dragon", name: "🐉 Dragon" };

export const miser: Character = { id: "miser", name: "🤵 Miser" };

export const poorMan: Character = { id: "poorMan", name: "🥺 Poor man" };

export const illBoy: Character = { id: "illBoy", name: "🤒 Ill boy" };

export const characters: EntityMap<Character> = entityMap([
  firebird,
  jackFrost,
  neptune,
  knight,
  princess,
  dragon,
  miser,
  poorMan,
  illBoy,
]);
