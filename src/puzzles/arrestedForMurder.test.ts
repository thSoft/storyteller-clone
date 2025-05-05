import { alessio, donMarcello, inspectorRinaldi, vincenzo } from "../characters";
import { arrest } from "../scenes/arrest";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHit } from "../scenes/orderHit";
import { shoot } from "../scenes/shoot";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { arrestedForMurder } from "./arrestedForMurder";

const validSolutions = [
  [
    panel(orderHit, donMarcello, vincenzo),
    panel(eavesdrop, inspectorRinaldi),
    panel(shoot, vincenzo, alessio),
    panel(arrest, inspectorRinaldi, vincenzo),
  ],
];

const invalidSolutions: Panel[][] = [
  [panel(orderHit, donMarcello, vincenzo), panel(shoot, vincenzo, alessio), panel(arrest, inspectorRinaldi, vincenzo)],
];

runPuzzleTests(arrestedForMurder, validSolutions, invalidSolutions);
