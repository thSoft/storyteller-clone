import { getStates } from "./simulator";
import { Panel, Puzzle } from "./types";

function testPuzzleWinCondition(
  puzzle: Puzzle,
  panels: Panel[],
  expectedResult: boolean
) {
  const states = getStates(panels, puzzle.initialStoryState);
  const finalState = states[states.length - 1];
  expect(puzzle.isWinning(finalState)).toBe(expectedResult);
}

/**
 * Runs tests for a puzzle with given valid and invalid solutions.
 * @param puzzle The puzzle to test.
 * @param validSolutions Array of Panel[] that should satisfy the win condition.
 * @param invalidSolutions Array of Panel[] that should not satisfy the win condition.
 */
export function runPuzzleTests(
  puzzle: Puzzle,
  validSolutions: Panel[][],
  invalidSolutions: Panel[][]
) {
  describe(`Puzzle: ${puzzle.title}`, () => {
    validSolutions.forEach((validPanels, index) => {
      it(`should satisfy the win condition with valid solution #${
        index + 1
      }`, () => {
        testPuzzleWinCondition(puzzle, validPanels, true);
      });
    });

    invalidSolutions.forEach((invalidPanels, index) => {
      it(`should not satisfy the win condition with invalid solution #${
        index + 1
      }`, () => {
        testPuzzleWinCondition(puzzle, invalidPanels, false);
      });
    });
  });
}
