import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { puzzles } from "./puzzles";
import { GameState, Panel } from "./types";

const initialGameState: GameState = {
  currentPuzzleId: null,
  currentChapterId: null,
  puzzleStates: Object.fromEntries(
    Object.keys(puzzles).map((puzzleId) => [puzzleId, { panels: [] }])
  ),
};

const gameStateSlice = createSlice({
  name: "gameState",
  initialState: initialGameState,
  reducers: {
    setCurrentPuzzleId(state, action: PayloadAction<string | null>) {
      state.currentPuzzleId = action.payload;
    },
    setCurrentChapterId(state, action: PayloadAction<string | null>) {
      state.currentChapterId = action.payload;
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
        const assignedCharacters =
          puzzle.panels[panelIndex].slotAssignedCharacters;
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
      const puzzle = state.puzzleStates[state.currentPuzzleId];
      if (puzzle) {
        puzzle.panels.splice(index, 0, panel);
      }
    },
    removePanelFromCurrentPuzzle(
      state,
      action: PayloadAction<{ index: number }>
    ) {
      const { index } = action.payload;
      if (!state.currentPuzzleId) {
        return;
      }
      const puzzle = state.puzzleStates[state.currentPuzzleId];
      if (puzzle && index >= 0 && index < puzzle.panels.length) {
        puzzle.panels.splice(index, 1);
      }
    },
  },
});

export const {
  setCurrentPuzzleId,
  setCurrentChapterId, // Updated export
  setSlotCharacter,
  addPanelToCurrentPuzzle,
  removePanelFromCurrentPuzzle,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
