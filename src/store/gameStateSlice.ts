import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { books, puzzles } from "../puzzles";
import { GameState, Panel } from "../types";

const initialGameState: GameState = {
  currentPuzzleId: null,
  currentBookId: null,
  puzzleStates: Object.fromEntries(Object.keys(puzzles).map((puzzleId) => [puzzleId, { panels: [] }])),
};

function findChapterId(puzzleId: string): string {
  return Object.values(books).find((chapter) => chapter.puzzles.includes(puzzleId))?.id ?? Object.keys(books)[0];
}

const gameStateSlice = createSlice({
  name: "gameState",
  initialState: initialGameState,
  reducers: {
    setCurrentPuzzleId(state, action: PayloadAction<string | null>) {
      const currentPuzzleId = action.payload;
      state.currentPuzzleId = currentPuzzleId;
      if (currentPuzzleId) {
        if (puzzles[currentPuzzleId]) {
          state.currentBookId = findChapterId(currentPuzzleId);
        } else {
          state.puzzleStates[currentPuzzleId] = { panels: [] };
        }
      }
    },
    setCurrentBookId(state, action: PayloadAction<string | null>) {
      state.currentBookId = action.payload;
    },
    setSlotCharacter(
      state,
      action: PayloadAction<{
        panelIndex: number;
        slotId: string;
        characterId: string;
      }>
    ) {
      const { panelIndex, slotId, characterId } = action.payload;
      if (!state.currentPuzzleId) {
        return;
      }
      const puzzle = state.puzzleStates[state.currentPuzzleId];
      if (puzzle && puzzle.panels[panelIndex]) {
        const assignedCharacters = puzzle.panels[panelIndex].slotAssignedCharacters;
        for (const otherSlotId in assignedCharacters) {
          if (assignedCharacters[otherSlotId] === characterId) {
            delete assignedCharacters[otherSlotId];
          }
        }
        assignedCharacters[slotId] = characterId;
      }
    },
    addPanelToCurrentPuzzle(
      state,
      action: PayloadAction<{
        index: number;
        panel: Panel;
      }>
    ) {
      const { index, panel } = action.payload;
      if (!state.currentPuzzleId) {
        return;
      }
      const puzzleState = state.puzzleStates[state.currentPuzzleId];
      if (puzzleState) {
        if (puzzleState.panels.length >= puzzles[state.currentPuzzleId].maxPanelCount) {
          console.warn("Cannot add more panels. Max panel count reached.");
          return; // Prevent adding the panel
        }
        puzzleState.panels.splice(index, 0, panel);
      } else {
        state.puzzleStates[state.currentPuzzleId] = { panels: [panel] };
      }
    },
    removePanelFromCurrentPuzzle(state, action: PayloadAction<{ index: number }>) {
      const { index } = action.payload;
      if (!state.currentPuzzleId) {
        return;
      }
      const puzzleState = state.puzzleStates[state.currentPuzzleId];
      if (puzzleState && index >= 0 && index < puzzleState.panels.length) {
        puzzleState.panels.splice(index, 1);
      }
    },
    markPuzzleCompleted(state, action: PayloadAction<{ puzzleId: string }>) {
      const { puzzleId } = action.payload;
      if (state.puzzleStates[puzzleId]) {
        state.puzzleStates[puzzleId].completed = true;
      }
    },
  },
});

export const {
  setCurrentPuzzleId,
  setCurrentBookId,
  setSlotCharacter,
  addPanelToCurrentPuzzle,
  removePanelFromCurrentPuzzle,
  markPuzzleCompleted,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
