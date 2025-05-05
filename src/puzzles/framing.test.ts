import { alessio, bruno, donMarcello, donRomano, inspectorRinaldi, vincenzo } from "../characters";
import { arrest } from "../scenes/arrest";
import { eavesdrop } from "../scenes/eavesdrop";
import { impersonate } from "../scenes/impersonate";
import { orderHeist } from "../scenes/orderHeist";
import { orderHit } from "../scenes/orderHit";
import { robTheBank } from "../scenes/robTheBank";
import { shoot } from "../scenes/shoot";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { framing } from "./framing";

const validSolutions = [
  [
    panel(orderHit, donMarcello, vincenzo),
    panel(impersonate, vincenzo, bruno),
    panel(eavesdrop, inspectorRinaldi),
    panel(shoot, vincenzo, alessio),
    panel(arrest, inspectorRinaldi, bruno),
  ],
  [
    panel(orderHeist, donRomano, bruno),
    panel(impersonate, bruno, vincenzo),
    panel(eavesdrop, inspectorRinaldi),
    panel(robTheBank, bruno),
    panel(arrest, inspectorRinaldi, vincenzo),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(framing, validSolutions, invalidSolutions);
