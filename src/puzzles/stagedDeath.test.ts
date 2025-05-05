import { alessio, donMarcello, vincenzo } from "../characters";
import { disclose } from "../scenes/disclose";
import { orderHit } from "../scenes/orderHit";
import { shoot } from "../scenes/shoot";
import { wearBulletproofVest } from "../scenes/wearBulletproofVest";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { stagedDeath } from "./stagedDeath";

const validSolutions = [
  [
    panel(orderHit, donMarcello, vincenzo),
    panel(wearBulletproofVest, alessio),
    panel(shoot, vincenzo, alessio),
    panel(disclose, vincenzo, donMarcello),
    panel(disclose, alessio, donMarcello),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(stagedDeath, validSolutions, invalidSolutions);
