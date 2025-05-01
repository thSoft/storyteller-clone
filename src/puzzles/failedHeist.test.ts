import { bruno, donRomano, vincenzo } from "../characters";
import { deal } from "../scenes/deal";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { heist } from "../scenes/heist";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { failedHeist } from "./failedHeist";
const validSolutions = [
  [
    panel(eavesdrop, vincenzo),
    panel(deal, donRomano, bruno),
    panel(heist, vincenzo),
    panel(heist, bruno),
    panel(disclose, bruno, donRomano),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(failedHeist, validSolutions, invalidSolutions);
