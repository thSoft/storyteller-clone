import { failedHit } from "./puzzles/failedHit";
import { successfulHeist } from "./puzzles/successfulHeist";
import { successfulHit } from "./puzzles/successfulHit";
import { Chapter, EntityMap } from "./types";
import { entityMap } from "./utils";

export const puzzles = entityMap([successfulHit, successfulHeist, failedHit]);

export const chapters: EntityMap<Chapter> = entityMap([
  {
    id: "mafia",
    title: "Mafia",
    puzzles: [successfulHit.id, successfulHeist.id, failedHit.id],
  },
]);
