import { alessio, donMarcello, lucia } from "../characters";
import { confrontation } from "../scenes/confrontation";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { love } from "../scenes/love";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { disownedChild } from "./disownedChild";

const validSolutions = [
  [panel(eavesdrop, donMarcello), panel(love, lucia, alessio), panel(confrontation, donMarcello, lucia)],
  [panel(eavesdrop, donMarcello), panel(love, alessio, lucia), panel(confrontation, donMarcello, lucia)],
  [panel(love, lucia, alessio), panel(disclose, lucia, donMarcello), panel(confrontation, donMarcello, lucia)],
  [panel(love, lucia, alessio), panel(disclose, alessio, donMarcello), panel(confrontation, donMarcello, lucia)],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(disownedChild, validSolutions, invalidSolutions);
