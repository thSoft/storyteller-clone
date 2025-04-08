import { firebird, jackFrost, neptune } from "../characters";
import { duel, fighter1Slot, fighter2Slot } from "../scenes/duel";
import { runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { elementalBattle } from "./elementalBattle";

const validSolutions: Panel[][] = [
  [
    {
      sceneId: duel.id,
      slotAssignedCharacters: {
        [fighter1Slot.id]: neptune.id,
        [fighter2Slot.id]: jackFrost.id,
      },
    },
    {
      sceneId: duel.id,
      slotAssignedCharacters: {
        [fighter1Slot.id]: firebird.id,
        [fighter2Slot.id]: jackFrost.id,
      },
    },
  ],
];

const invalidSolutions: Panel[][] = [
  [
    {
      sceneId: duel.id,
      slotAssignedCharacters: {
        [fighter1Slot.id]: firebird.id,
        [fighter2Slot.id]: jackFrost.id,
      },
    },
    {
      sceneId: duel.id,
      slotAssignedCharacters: {
        [fighter1Slot.id]: neptune.id,
        [fighter2Slot.id]: jackFrost.id,
      },
    },
  ],
];

runPuzzleTests(elementalBattle, validSolutions, invalidSolutions);
