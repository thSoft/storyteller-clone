import { Character, EntityMap } from "./types";
import { entityMap } from "./utils";

export const donMarcello: Character = {
  id: "donMarcello",
  name: "Don Marcello",
};

export const vincenzo: Character = { id: "vincenzo", name: "Vincenzo" };

export const lucia: Character = { id: "lucia", name: "Lucia" };

export const nico: Character = { id: "nico", name: "Nico" };

export const donRomano: Character = { id: "donRomano", name: "Don Romano" };

export const alessio: Character = { id: "alessio", name: "Alessio" };

export const bruno: Character = { id: "bruno", name: "Bruno" };

export const inspectorRinaldi: Character = {
  id: "inspectorRinaldi",
  name: "Inspector Rinaldi",
};

export const characters: EntityMap<Character> = entityMap([
  donMarcello,
  vincenzo,
  lucia,
  nico,
  donRomano,
  alessio,
  bruno,
  inspectorRinaldi,
]);
