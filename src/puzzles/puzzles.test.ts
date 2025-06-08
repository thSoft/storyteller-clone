import { puzzles } from "../puzzles";
import { runPuzzleTests } from "../testUtils";

for (const puzzle of Object.values(puzzles)) {
  runPuzzleTests(puzzle);
}
