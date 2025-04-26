import { donMarcello, inspectorRinaldi, vincenzo } from "../characters";
import { confrontation } from "../scenes/confrontation";
import { deal } from "../scenes/deal";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { failedHit } from "./failedHit";

const validSolutions = [
  [
    panel(eavesdrop, inspectorRinaldi, vincenzo),
    panel(deal, donMarcello, vincenzo),
    panel(confrontation, inspectorRinaldi, vincenzo),
    panel(disclose, vincenzo, donMarcello),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(failedHit, validSolutions, invalidSolutions);
