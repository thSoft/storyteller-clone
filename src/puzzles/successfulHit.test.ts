import { alessio, donMarcello, vincenzo } from "../characters";
import { deal } from "../scenes/deal";
import { disclose } from "../scenes/disclose";
import { hit } from "../scenes/hit";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { successfulHit } from "./successfulHit";

const validSolutions: Panel[][] = [
  [panel(deal, donMarcello, vincenzo), panel(hit, vincenzo, alessio), panel(disclose, vincenzo, donMarcello)],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(successfulHit, validSolutions, invalidSolutions);
