import { getStates } from "./simulator";
import { createStateProxy } from "./stateProxy";
import { Panel, Puzzle } from "./types";

export function isPuzzleWon(puzzle: Puzzle, panels: Panel[]): boolean {
  const states = getStates(panels, puzzle.initialStoryState);
  const lastState = states[states.length - 1];
  return puzzle.isWinning(createStateProxy(lastState));
}
