import { alessio, donMarcello, donRomano, inspectorRinaldi, vincenzo } from "../characters";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHeist } from "../scenes/orderHeist";
import { orderHit } from "../scenes/orderHit";
import { robTheBank } from "../scenes/robTheBank";
import { shoot } from "../scenes/shoot";
import { wearArmor } from "../scenes/wearArmor";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { avoidingArrest } from "./avoidingArrest";

const validSolutions = [
  [
    panel(orderHeist, donRomano, alessio),
    panel(eavesdrop, inspectorRinaldi),
    panel(robTheBank, alessio),
    panel(orderHit, donMarcello, vincenzo),
    panel(wearArmor, alessio),
    panel(eavesdrop, inspectorRinaldi),
    panel(disclose, donRomano),
    panel(shoot, vincenzo, alessio),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(avoidingArrest, validSolutions, invalidSolutions);
