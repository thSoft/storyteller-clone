import { hunter, red, wolf } from "../characters";
import { forest } from "../scenes/forest";
import { grandmasHouse } from "../scenes/grandmasHouse";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { outsmartedWolf } from "./outsmartedWolf";

const validSolutions: Panel[][] = [
  [panel(forest, red, wolf), panel(grandmasHouse, hunter, wolf)],
  [panel(forest, wolf, red), panel(grandmasHouse, hunter, wolf)],
  [panel(forest, red, wolf), panel(grandmasHouse, wolf, hunter)],
  [panel(forest, wolf, red), panel(grandmasHouse, wolf, hunter)],
  [
    panel(forest, wolf, red),
    panel(forest, hunter, red),
    panel(grandmasHouse, hunter, wolf),
  ],
];

const invalidSolutions: Panel[][] = [[panel(grandmasHouse, wolf, hunter)]];

runPuzzleTests(outsmartedWolf, validSolutions, invalidSolutions);
