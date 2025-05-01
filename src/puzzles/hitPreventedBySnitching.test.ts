import { alessio, bruno, donMarcello, donRomano, inspectorRinaldi, vincenzo } from "../characters";
import { confrontation } from "../scenes/confrontation";
import { deal } from "../scenes/deal";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { hitPreventedBySnitching } from "./hitPreventedBySnitching";

const validSolutions = [
  [
    panel(eavesdrop, donRomano),
    panel(deal, donMarcello, vincenzo),
    panel(disclose, donRomano, inspectorRinaldi),
    panel(confrontation, inspectorRinaldi, vincenzo),
  ],
  [
    panel(eavesdrop, alessio),
    panel(deal, donMarcello, vincenzo),
    panel(disclose, alessio, inspectorRinaldi),
    panel(confrontation, inspectorRinaldi, vincenzo),
  ],
  [
    panel(eavesdrop, bruno),
    panel(deal, donMarcello, vincenzo),
    panel(disclose, bruno, inspectorRinaldi),
    panel(confrontation, inspectorRinaldi, vincenzo),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(hitPreventedBySnitching, validSolutions, invalidSolutions);
