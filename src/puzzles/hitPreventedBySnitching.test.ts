import { alessio, bruno, donMarcello, donRomano, inspectorRinaldi, vincenzo } from "../characters";
import { confiscate } from "../scenes/confiscate";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHit } from "../scenes/orderHit";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { hitPreventedBySnitching } from "./hitPreventedBySnitching";

const validSolutions = [
  [
    panel(eavesdrop, donRomano),
    panel(orderHit, donMarcello, vincenzo),
    panel(disclose, donRomano, inspectorRinaldi),
    panel(confiscate, inspectorRinaldi, vincenzo),
  ],
  [
    panel(eavesdrop, alessio),
    panel(orderHit, donMarcello, vincenzo),
    panel(disclose, alessio, inspectorRinaldi),
    panel(confiscate, inspectorRinaldi, vincenzo),
  ],
  [
    panel(eavesdrop, bruno),
    panel(orderHit, donMarcello, vincenzo),
    panel(disclose, bruno, inspectorRinaldi),
    panel(confiscate, inspectorRinaldi, vincenzo),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(hitPreventedBySnitching, validSolutions, invalidSolutions);
