import { backfire } from "./puzzles/backfire";
import { christmasCarol } from "./puzzles/christmasCarol";
import { cunningWolf } from "./puzzles/cunningWolf";
import { dragonBattle } from "./puzzles/dragonBattle";
import { elementalBattle } from "./puzzles/elementalBattle";
import { heist } from "./puzzles/heist";
import { outsmartedWolf } from "./puzzles/outsmartedWolf";
import { sacrifice } from "./puzzles/sacrifice";
import { Chapter, EntityMap } from "./types";
import { entityMap } from "./utils";

export const puzzles = entityMap([
  christmasCarol,
  heist,
  elementalBattle,
  dragonBattle,
  cunningWolf,
  outsmartedWolf,
  sacrifice,
  backfire,
]);

export const chapters: EntityMap<Chapter> = entityMap([
  {
    id: "brokenHearts",
    title: "Broken Hearts Everywhere",
    puzzles: [backfire.id],
  },
  {
    id: "money",
    title: "Money, Money, Money",
    puzzles: [christmasCarol.id, heist.id],
  },
  {
    id: "battles",
    title: "Epic Battles",
    puzzles: [elementalBattle.id, dragonBattle.id],
  },
  {
    id: "red",
    title: "Little Red Riding Hood Variations",
    puzzles: [cunningWolf.id, outsmartedWolf.id, sacrifice.id],
  },
]);
