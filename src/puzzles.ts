import { entityMap, EntityMap } from "./entities";
import { arrestedForMurder } from "./puzzles/arrestedForMurder";
import { avoidingArrest } from "./puzzles/avoidingArrest";
import { disownment } from "./puzzles/disownedChild";
import { failedHeist } from "./puzzles/failedHeist";
import { failedHit } from "./puzzles/failedHit";
import { framing } from "./puzzles/framing";
import { hitPreventedBySnitching } from "./puzzles/hitPreventedBySnitching";
import { luciaTakesOver } from "./puzzles/luciaTakesOver";
import { outsmarted } from "./puzzles/outsmarted";
import { revenge } from "./puzzles/revenge";
import { savedByLove } from "./puzzles/savedByLove";
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
  avoidingArrest,
  revenge,
  savedByLove,
  luciaTakesOver,
]);

export const books: EntityMap<Book> = entityMap([
  {
    id: "mafia",
    title: "Mafia",
    puzzles: [
      successfulHit.id,
      successfulHeist.id,
      failedHit.id,
      arrestedForMurder.id,
      outsmarted.id,
      stagedDeath.id,
      disownment.id,
      vincenzoTakesOver.id,
      hitPreventedBySnitching.id,
      savedByLove.id,
      failedHeist.id,
      framing.id,
      avoidingArrest.id,
      revenge.id,
      luciaTakesOver.id,
    ],
  },
]);
