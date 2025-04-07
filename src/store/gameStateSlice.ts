import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { chapters, puzzles } from "../puzzles";
import { GameState, Panel } from "../types";

const initialGameState: GameState = {
  currentPuzzleId: null,
  currentChapterId: null,
  puzzleStates: Object.fromEntries(
    Object.keys(puzzles).map((puzzleId) => [puzzleId, { panels: [] }])
  ),
};

function findChapterId(puzzleId: string): string {
  return (
    Object.values(chapters).find((chapter) =>
      chapter.puzzles.includes(puzzleId)
    )?.id ?? Object.keys(chapters)[0]
  );
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
          state.currentChapterId = findChapterId(currentPuzzleId);
        } else {
          state.puzzleStates[currentPuzzleId] = { panels: [] };
        }
      }
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
      const puzzleState = state.puzzleStates[state.currentPuzzleId];
      if (puzzleState) {
        puzzleState.panels.splice(index, 0, panel);
      } else {
        state.puzzleStates[state.currentPuzzleId] = { panels: [panel] };
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
  setCurrentChapterId,
  setSlotCharacter,
  addPanelToCurrentPuzzle,
  removePanelFromCurrentPuzzle,
  markPuzzleCompleted,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
