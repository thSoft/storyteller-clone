import { donMarcello, inspectorRinaldi, nico, vincenzo } from "../characters";
import { deal } from "../scenes/deal";
import { death } from "../scenes/death";
import { takeover } from "../scenes/takeover";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

const validSolutions = [
  [panel(deal, inspectorRinaldi, nico), panel(death, donMarcello), panel(takeover, vincenzo)],
  [panel(death, donMarcello), panel(deal, inspectorRinaldi, nico), panel(takeover, vincenzo)],
];

const invalidSolutions: Panel[][] = [[panel(death, donMarcello), panel(takeover, vincenzo)]];

runPuzzleTests(vincenzoTakesOver, validSolutions, invalidSolutions);
