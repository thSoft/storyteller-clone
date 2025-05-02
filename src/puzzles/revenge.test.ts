import { alessio, bruno, donMarcello, donRomano, inspectorRinaldi, vincenzo } from "../characters";
import { confrontation } from "../scenes/confrontation";
import { deal } from "../scenes/deal";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { hit } from "../scenes/hit";
import { impersonate } from "../scenes/impersonate";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { revenge } from "./revenge";

const validSolutions = [
  [
    panel(deal, donMarcello, vincenzo),
    panel(eavesdrop, bruno),
    panel(hit, vincenzo, alessio),
    panel(disclose, bruno, donRomano),
    panel(deal, donRomano, bruno),
    panel(impersonate, bruno, inspectorRinaldi),
    panel(confrontation, bruno, vincenzo),
    panel(hit, bruno, vincenzo),
  ],
  [
    panel(eavesdrop, bruno),
    panel(deal, donMarcello, vincenzo),
    panel(eavesdrop, donRomano),
    panel(hit, vincenzo, alessio),
    panel(deal, donRomano, bruno),
    panel(impersonate, bruno, inspectorRinaldi),
    panel(confrontation, bruno, vincenzo),
    panel(hit, bruno, vincenzo),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(revenge, validSolutions, invalidSolutions);
