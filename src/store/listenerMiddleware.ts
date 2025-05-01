import { createListenerMiddleware } from "@reduxjs/toolkit";
import { isPuzzleWon as checkPuzzleWon } from "../puzzleUtils";
import { puzzles } from "../puzzles";
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
      if (checkPuzzleState(nextState, puzzleId)) {
        listenerApi.dispatch(markPuzzleCompleted({ puzzleId }));
      }
    }
  },
});

function checkPuzzleState(state: GameState, puzzleId: string): boolean {
  const puzzleState = state.puzzleStates[puzzleId];
  if (!puzzleState) {
    return false;
  }
  const puzzle = puzzles[puzzleId];
  if (!puzzle) {
    return false;
  }
  return checkPuzzleWon(puzzle, puzzleState.panels);
}
