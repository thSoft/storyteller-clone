import { alessio, donMarcello, lucia, vincenzo } from "../characters";
import { fallInLove } from "../scenes/fallInLove";
import { impersonate } from "../scenes/impersonate";
import { orderHit } from "../scenes/orderHit";
import { shoot } from "../scenes/shoot";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { savedByLove } from "./savedByLove";

const validSolutions = [
  [
    panel(fallInLove, lucia, alessio),
    panel(orderHit, donMarcello, vincenzo),
    panel(impersonate, lucia, alessio),
    panel(shoot, vincenzo, lucia),
  ],
];

const invalidSolutions: Panel[][] = [[]];

runPuzzleTests(savedByLove, validSolutions, invalidSolutions);
