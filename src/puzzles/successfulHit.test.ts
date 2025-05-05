import { alessio, donMarcello, vincenzo } from "../characters";
import { disclose } from "../scenes/disclose";
import { orderHit } from "../scenes/orderHit";
import { shoot } from "../scenes/shoot";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { successfulHit } from "./successfulHit";

const validSolutions: Panel[][] = [
  [panel(orderHit, donMarcello, vincenzo), panel(shoot, vincenzo, alessio), panel(disclose, vincenzo, donMarcello)],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(successfulHit, validSolutions, invalidSolutions);
