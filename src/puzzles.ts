import { elementalBattle } from "./puzzles/elementalBattle";
import { Chapter, EntityMap } from "./types";
import { entityMap } from "./utils";

export const puzzles = entityMap([elementalBattle]);

export const chapters: EntityMap<Chapter> = entityMap([
  {
    id: "battles",
    title: "Epic Battles",
    puzzles: [elementalBattle.id],
  },
]);
