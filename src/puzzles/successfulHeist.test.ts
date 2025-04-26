import { bruno, donRomano } from "../characters";
import { deal } from "../scenes/deal";
import { disclose } from "../scenes/disclose";
import { heist } from "../scenes/heist";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { successfulHeist } from "./successfulHeist";

const validSolutions: Panel[][] = [
  [panel(deal, donRomano, bruno), panel(heist, bruno), panel(disclose, bruno, donRomano)],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(successfulHeist, validSolutions, invalidSolutions);
