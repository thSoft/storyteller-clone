import { christmasCarol } from "./puzzles/christmasCarol";
import { dragonBattle } from "./puzzles/dragonBattle";
import { elementalBattle } from "./puzzles/elementalBattle";
import { Chapter, EntityMap } from "./types";
import { entityMap } from "./utils";

export const puzzles = entityMap([
  christmasCarol,
  elementalBattle,
  dragonBattle,
]);

export const chapters: EntityMap<Chapter> = entityMap([
  {
    id: "money",
    title: "Money, Money, Money",
    puzzles: [christmasCarol.id],
  },
  {
    id: "battles",
    title: "Epic Battles",
    puzzles: [elementalBattle.id, dragonBattle.id],
  },
]);
