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
  if (!puzzle.dependsOn) return true;
  return puzzleStates[puzzle.dependsOn]?.completed === true;
}

export function getPuzzleTooltip(puzzleId: string, puzzleStates: Record<string, PuzzleState>): string | undefined {
  const puzzle = puzzles[puzzleId];
  if (!puzzle.dependsOn) return undefined;
  const isEnabled = isPuzzleEnabled(puzzleId, puzzleStates);
  if (!isEnabled) {
    const dependencyPuzzle = puzzles[puzzle.dependsOn];
    return `Complete "${dependencyPuzzle.title}" first`;
  }
  return undefined;
}
