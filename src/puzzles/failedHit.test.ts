import { donMarcello, inspectorRinaldi, vincenzo } from "../characters";
import { confiscate } from "../scenes/confiscate";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHit } from "../scenes/orderHit";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { failedHit } from "./failedHit";

const validSolutions = [
  [
    panel(eavesdrop, inspectorRinaldi),
    panel(orderHit, donMarcello, vincenzo),
    panel(confiscate, inspectorRinaldi, vincenzo),
    panel(disclose, vincenzo, donMarcello),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(failedHit, validSolutions, invalidSolutions);
