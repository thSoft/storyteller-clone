import { alessio, bruno, donRomano } from "../characters";
import { disclose } from "../scenes/disclose";
import { orderHeist } from "../scenes/orderHeist";
import { robTheBank } from "../scenes/robTheBank";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { successfulHeist } from "./successfulHeist";

const validSolutions: Panel[][] = [
  [panel(orderHeist, donRomano, bruno), panel(robTheBank, bruno), panel(disclose, bruno, donRomano)],
  [panel(orderHeist, donRomano, alessio), panel(robTheBank, alessio), panel(disclose, alessio, donRomano)],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(successfulHeist, validSolutions, invalidSolutions);
