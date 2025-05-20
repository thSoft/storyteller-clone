import { puzzles } from "./puzzles";
import { getStates } from "./simulator";
import { createStateProxy } from "./stateProxy";
import { Panel, Puzzle, PuzzleState } from "./types";

function isAllPuzzlesEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("enableAllPuzzles") === "true";
}

export function isPuzzleWon(puzzle: Puzzle, panels: Panel[]): boolean {
  const states = getStates(panels, puzzle.initialStoryState);
  const lastState = states[states.length - 1];
  return puzzle.isWinning(createStateProxy(lastState));
}

export function isPuzzleEnabled(puzzleId: string, puzzleStates: Record<string, PuzzleState>): boolean {
  if (isAllPuzzlesEnabled()) return true;
  const puzzle = puzzles[puzzleId];
  if (!puzzle.dependsOn || puzzle.dependsOn.length === 0) return true;
  // All dependencies must be completed
  return puzzle.dependsOn.every((depId) => puzzleStates[depId]?.completed === true);
}

export function getPuzzleTooltip(puzzleId: string, puzzleStates: Record<string, PuzzleState>): string | undefined {
  const puzzle = puzzles[puzzleId];
  if (!puzzle.dependsOn || puzzle.dependsOn.length === 0) return undefined;
  const isEnabled = isPuzzleEnabled(puzzleId, puzzleStates);
  if (!isEnabled) {
    // List unmet dependencies
    const unmet = puzzle.dependsOn.filter((depId) => !puzzleStates[depId]?.completed);
    if (unmet.length === 1) {
      const dependencyPuzzle = puzzles[unmet[0]];
      return `To unlock, complete ${dependencyPuzzle?.title || unmet[0]}`;
    } else if (unmet.length > 1) {
      const titles = unmet.map((depId) => `${puzzles[depId]?.title || depId}`).join(", ");
      return `To unlock, complete ${titles}`;
    }
  }
  return undefined;
}
