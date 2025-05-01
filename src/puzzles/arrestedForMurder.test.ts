import { alessio, donMarcello, inspectorRinaldi, vincenzo } from "../characters";
import { confrontation } from "../scenes/confrontation";
import { deal } from "../scenes/deal";
import { eavesdrop } from "../scenes/eavesdrop";
import { hit } from "../scenes/hit";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { arrestedForMurder } from "./arrestedForMurder";

const validSolutions = [
  [
    panel(deal, donMarcello, vincenzo),
    panel(eavesdrop, inspectorRinaldi),
    panel(hit, vincenzo, alessio),
    panel(confrontation, inspectorRinaldi, vincenzo),
  ],
];

const invalidSolutions: Panel[][] = [
  [panel(deal, donMarcello, vincenzo), panel(hit, vincenzo, alessio), panel(confrontation, inspectorRinaldi, vincenzo)],
];

runPuzzleTests(arrestedForMurder, validSolutions, invalidSolutions);
