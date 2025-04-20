import { grandma, hunter, red, wolf } from "../characters";
import { forest } from "../scenes/forest";
import { grandmasHouse } from "../scenes/grandmasHouse";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { cunningWolf } from "./cunningWolf";

const validSolutions: Panel[][] = [
  [
    panel(forest, red, wolf),
    panel(grandmasHouse, wolf, grandma),
    panel(grandmasHouse, wolf, red),
    panel(grandmasHouse, wolf, hunter),
  ],
];

const invalidSolutions: Panel[][] = [
  [
    panel(grandmasHouse, wolf, grandma),
    panel(grandmasHouse, wolf, red),
    panel(grandmasHouse, wolf, hunter),
  ],
];

runPuzzleTests(cunningWolf, validSolutions, invalidSolutions);
