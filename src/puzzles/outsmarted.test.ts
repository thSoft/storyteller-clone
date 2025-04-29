import { bruno, donMarcello, vincenzo } from "../characters";
import { confrontation } from "../scenes/confrontation";
import { deal } from "../scenes/deal";
import { impersonate } from "../scenes/impersonate";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { outsmarted } from "./outsmarted";

const validSolutions = [
  [
    panel(impersonate, bruno, vincenzo),
    panel(deal, donMarcello, bruno),
    panel(impersonate, bruno),
    panel(confrontation, bruno, donMarcello),
  ],
];

const invalidSolutions: Panel[][] = [
  [panel(impersonate, bruno, vincenzo), panel(deal, donMarcello, bruno), panel(confrontation, bruno, donMarcello)],
];

runPuzzleTests(outsmarted, validSolutions, invalidSolutions);
