import { bruno, donRomano, vincenzo } from "../characters";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHeist } from "../scenes/orderHeist";
import { robTheBank } from "../scenes/robTheBank";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { failedHeist } from "./failedHeist";
const validSolutions = [
  [
    panel(eavesdrop, vincenzo),
    panel(orderHeist, donRomano, bruno),
    panel(robTheBank, vincenzo),
    panel(robTheBank, bruno),
    panel(disclose, bruno, donRomano),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(failedHeist, validSolutions, invalidSolutions);
