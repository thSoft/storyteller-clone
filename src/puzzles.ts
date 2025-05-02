import { entityMap, EntityMap } from "./entities";
import { arrestedForMurder } from "./puzzles/arrestedForMurder";
import { disownment } from "./puzzles/disownedChild";
import { failedHeist } from "./puzzles/failedHeist";
import { failedHit } from "./puzzles/failedHit";
import { framing } from "./puzzles/framing";
import { hitPreventedBySnitching } from "./puzzles/hitPreventedBySnitching";
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
  arrestedForMurder,
  hitPreventedBySnitching,
  failedHeist,
  framing,
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
      arrestedForMurder.id,
      hitPreventedBySnitching.id,
      failedHeist.id,
      framing.id,
    ],
  },
]);
