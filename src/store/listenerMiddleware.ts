import { createListenerMiddleware } from "@reduxjs/toolkit";
import { puzzles } from "../puzzles";
import { getStates } from "../simulator";
import type { GameState } from "../types";
import { markPuzzleCompleted } from "./gameStateSlice";

export const listenerMiddleware = createListenerMiddleware<GameState>();

listenerMiddleware.startListening({
  predicate: (_, currentState, previousState) => {
    return currentState.puzzleStates !== previousState.puzzleStates;
  },
  effect: async (_, listenerApi) => {
    const nextState = listenerApi.getState() as GameState;
    for (const puzzleId of Object.keys(nextState.puzzleStates)) {
      if (isPuzzleWon(nextState, puzzleId)) {
        listenerApi.dispatch(markPuzzleCompleted({ puzzleId }));
      }
    }
  },
});

function isPuzzleWon(state: GameState, puzzleId: string): boolean {
  const puzzleState = state.puzzleStates[puzzleId];
  if (!puzzleState) {
    return false;
  }
  const puzzle = puzzles[puzzleId];
  if (!puzzle) {
    return false;
  }
  const states = getStates(puzzleState.panels, puzzle.initialStoryState);
  return puzzle.isWinning(states[states.length - 1]);
}
