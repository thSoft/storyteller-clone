import { disownment } from "./puzzles/disownedChild";
import { failedHit } from "./puzzles/failedHit";
import { stagedDeath } from "./puzzles/stagedDeath";
import { successfulHeist } from "./puzzles/successfulHeist";
import { successfulHit } from "./puzzles/successfulHit";
import { vincenzoTakesOver } from "./puzzles/vincenzoTakesOver";
import { Book, EntityMap } from "./types";
import { entityMap } from "./utils";

export const puzzles = entityMap([
  successfulHit,
  successfulHeist,
  failedHit,
  disownment,
  vincenzoTakesOver,
  stagedDeath,
]);

export const books: EntityMap<Book> = entityMap([
  {
    id: "mafia",
    title: "Mafia",
    puzzles: [successfulHit.id, successfulHeist.id, failedHit.id, disownment.id, stagedDeath.id, vincenzoTakesOver.id],
  },
]);
