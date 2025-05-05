import { alessio, bruno, donMarcello, donRomano, inspectorRinaldi, vincenzo } from "../characters";
import { confiscate } from "../scenes/confiscate";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { impersonate } from "../scenes/impersonate";
import { orderHit } from "../scenes/orderHit";
import { shoot } from "../scenes/shoot";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { revenge } from "./revenge";

const validSolutions = [
  [
    panel(orderHit, donMarcello, vincenzo),
    panel(eavesdrop, bruno),
    panel(shoot, vincenzo, alessio),
    panel(disclose, bruno, donRomano),
    panel(orderHit, donRomano, bruno),
    panel(impersonate, bruno, inspectorRinaldi),
    panel(confiscate, bruno, vincenzo),
    panel(shoot, bruno, vincenzo),
  ],
  [
    panel(eavesdrop, bruno),
    panel(orderHit, donMarcello, vincenzo),
    panel(eavesdrop, donRomano),
    panel(shoot, vincenzo, alessio),
    panel(orderHit, donRomano, bruno),
    panel(impersonate, bruno, inspectorRinaldi),
    panel(confiscate, bruno, vincenzo),
    panel(shoot, bruno, vincenzo),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(revenge, validSolutions, invalidSolutions);
