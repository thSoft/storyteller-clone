import { christmasCarol } from "./puzzles/christmasCarol";
import { dragonBattle } from "./puzzles/dragonBattle";
import { elementalBattle } from "./puzzles/elementalBattle";
import { heist } from "./puzzles/heist";
import { Chapter, EntityMap } from "./types";
import { entityMap } from "./utils";

export const puzzles = entityMap([
  christmasCarol,
  heist,
  elementalBattle,
  dragonBattle,
]);

export const chapters: EntityMap<Chapter> = entityMap([
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
]);
