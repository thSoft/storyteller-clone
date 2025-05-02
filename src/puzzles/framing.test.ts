import { alessio, bruno, donMarcello, donRomano, inspectorRinaldi, vincenzo } from "../characters";
import { confrontation } from "../scenes/confrontation";
import { deal } from "../scenes/deal";
import { eavesdrop } from "../scenes/eavesdrop";
import { heist } from "../scenes/heist";
import { hit } from "../scenes/hit";
import { impersonate } from "../scenes/impersonate";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { framing } from "./framing";

const validSolutions = [
  [
    panel(deal, donMarcello, vincenzo),
    panel(impersonate, vincenzo, bruno),
    panel(eavesdrop, inspectorRinaldi),
    panel(hit, vincenzo, alessio),
    panel(confrontation, inspectorRinaldi, bruno),
  ],
  [
    panel(deal, donRomano, bruno),
    panel(impersonate, bruno, vincenzo),
    panel(eavesdrop, inspectorRinaldi),
    panel(heist, bruno),
    panel(confrontation, inspectorRinaldi, vincenzo),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(framing, validSolutions, invalidSolutions);
