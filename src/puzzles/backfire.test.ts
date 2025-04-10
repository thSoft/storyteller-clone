import { edgar, isobel, lenora } from "../characters";
import { kidnap } from "../scenes/kidnap";
import { love } from "../scenes/love";
import { poison } from "../scenes/poison";
import { wine } from "../scenes/wine";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { backfire } from "./backfire";

const validSolutions: Panel[][] = [
  [
    panel(love, edgar, lenora),
    panel(love, edgar, isobel),
    panel(kidnap, isobel, lenora),
    panel(kidnap, edgar, lenora),
    panel(poison, lenora),
    panel(wine, edgar),
    panel(love, edgar, lenora),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(backfire, validSolutions, invalidSolutions);
