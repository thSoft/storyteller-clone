import { Character, EntityMap } from "./types";
import { entityMap } from "./utils";

export const firebird: Character = { id: "firebird", name: "🔥 The Firebird" };

export const jackFrost: Character = { id: "jackFrost", name: "❄️ Jack Frost" };

export const neptune: Character = { id: "neptune", name: "💧 Neptune" };

export const knight: Character = { id: "knight", name: "🏇 Knight" };

export const princess: Character = { id: "princess", name: "👸 Princess" };

export const dragon: Character = { id: "dragon", name: "🐉 Dragon" };

export const miser: Character = { id: "miser", name: "🤑 Miser" };

export const poorMan: Character = { id: "poorMan", name: "🥺 Poor man" };

export const illBoy: Character = { id: "illBoy", name: "🤒 Ill boy" };

export const duke: Character = { id: "duke", name: "🧔‍♂️ Duke" };

export const duchess: Character = { id: "duchess", name: "👩‍🦰 Duchess" };

export const butler: Character = { id: "butler", name: "🤵 Butler" };

export const red: Character = { id: "red", name: "👩‍🦰 Red" };

export const wolf: Character = { id: "wolf", name: "🐺 Wolf" };

export const grandma: Character = { id: "grandma", name: "👵 Grandma" };

export const hunter: Character = { id: "hunter", name: "👮‍♂️ Hunter" };

export const edgar: Character = { id: "edgar", name: "👨 Edgar" };

export const lenora: Character = { id: "lenora", name: "🙎‍♀️ Lenora" };

export const isobel: Character = { id: "isobel", name: "👩 Isobel" };

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
  duke,
  duchess,
  butler,
  red,
  wolf,
  grandma,
  hunter,
  edgar,
  lenora,
  isobel,
]);
