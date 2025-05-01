import { entityMap, EntityMap } from "./entities";
import { disownment } from "./puzzles/disownedChild";
import { failedHit } from "./puzzles/failedHit";
import { outsmarted } from "./puzzles/outsmarted";
import { stagedDeath } from "./puzzles/stagedDeath";
import { successfulHeist } from "./puzzles/successfulHeist";
import { successfulHit } from "./puzzles/successfulHit";
import { vincenzoTakesOver } from "./puzzles/vincenzoTakesOver";
import { Book } from "./types";

export const puzzles = entityMap([
  successfulHit,
  successfulHeist,
  failedHit,
  disownment,
  vincenzoTakesOver,
  stagedDeath,
  outsmarted,
]);

export const books: EntityMap<Book> = entityMap([
  {
    id: "mafia",
    title: "Mafia",
    puzzles: [
      successfulHit.id,
      successfulHeist.id,
      failedHit.id,
      disownment.id,
      outsmarted.id,
      stagedDeath.id,
      vincenzoTakesOver.id,
    ],
  },
]);
