import { edgar, isobel, lenora } from "../characters";
import { kidnap, kidnappedSlot, kidnapperSlot } from "../scenes/kidnap";
import { love, lover1Slot, lover2Slot } from "../scenes/love";
import { poison, poisonerSlot } from "../scenes/poison";
import { wine, wineDrinkerSlot } from "../scenes/wine";
import { runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { backfire } from "./backfire";

const validSolutions: Panel[][] = [
  [
    {
      sceneId: love.id,
      slotAssignedCharacters: {
        [lover1Slot.id]: edgar.id,
        [lover2Slot.id]: lenora.id,
      },
    },
    {
      sceneId: love.id,
      slotAssignedCharacters: {
        [lover1Slot.id]: edgar.id,
        [lover2Slot.id]: isobel.id,
      },
    },
    {
      sceneId: kidnap.id,
      slotAssignedCharacters: {
        [kidnapperSlot.id]: isobel.id,
        [kidnappedSlot.id]: lenora.id,
      },
    },
    {
      sceneId: kidnap.id,
      slotAssignedCharacters: {
        [kidnapperSlot.id]: edgar.id,
        [kidnappedSlot.id]: lenora.id,
      },
    },
    {
      sceneId: poison.id,
      slotAssignedCharacters: {
        [poisonerSlot.id]: lenora.id,
      },
    },
    {
      sceneId: wine.id,
      slotAssignedCharacters: {
        [wineDrinkerSlot.id]: edgar.id,
      },
    },
    {
      sceneId: love.id,
      slotAssignedCharacters: {
        [lover1Slot.id]: edgar.id,
        [lover2Slot.id]: lenora.id,
      },
    },
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(backfire, validSolutions, invalidSolutions);
