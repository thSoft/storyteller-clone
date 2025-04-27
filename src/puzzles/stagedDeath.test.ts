import { alessio, donMarcello, vincenzo } from "../characters";
import { confrontation } from "../scenes/confrontation";
import { deal } from "../scenes/deal";
import { disclose } from "../scenes/disclose";
import { hit } from "../scenes/hit";
import { shield } from "../scenes/shield";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { stagedDeath } from "./stagedDeath";

const validSolutions = [
  [
    panel(deal, donMarcello, vincenzo),
    panel(shield, alessio),
    panel(hit, vincenzo, alessio),
    panel(disclose, vincenzo, donMarcello),
    panel(confrontation, alessio, donMarcello),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(stagedDeath, validSolutions, invalidSolutions);
