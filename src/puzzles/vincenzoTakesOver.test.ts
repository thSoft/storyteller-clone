import { donMarcello, inspectorRinaldi, nico, vincenzo } from "../characters";
import { die } from "../scenes/die";
import { recruit } from "../scenes/recruit";
import { takeOver } from "../scenes/takeover";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

const validSolutions = [
  [panel(recruit, inspectorRinaldi, nico), panel(die, donMarcello), panel(takeOver, vincenzo)],
  [panel(die, donMarcello), panel(recruit, inspectorRinaldi, nico), panel(takeOver, vincenzo)],
];

const invalidSolutions: Panel[][] = [
  [panel(die, donMarcello), panel(takeOver, vincenzo)],
  [panel(die, nico), panel(die, donMarcello), panel(takeOver, vincenzo)],
];

runPuzzleTests(vincenzoTakesOver, validSolutions, invalidSolutions);
