import { firebird, jackFrost, neptune } from "../characters";
import { duel } from "../scenes/duel";
import { panel, runPuzzleTests } from "../testUtils";
import { Panel } from "../types";
import { elementalBattle } from "./elementalBattle";

const validSolutions: Panel[][] = [
  [panel(duel, neptune, jackFrost), panel(duel, firebird, jackFrost)],
];

const invalidSolutions: Panel[][] = [
  [panel(duel, firebird, jackFrost), panel(duel, neptune, jackFrost)],
];

runPuzzleTests(elementalBattle, validSolutions, invalidSolutions);
