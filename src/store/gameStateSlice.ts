import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { books, puzzles } from "../puzzles";
import { scenes } from "../scenes";
import { placeholder } from "../scenes/placeholder";
import { GameState, Panel, PuzzleState } from "../types";

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
        state.currentBookId = findChapterId(currentPuzzleId);
        padPanels(currentPuzzleId, state.puzzleStates);
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
    setPanelScene(
      state,
      action: PayloadAction<{
        index: number;
        sceneId: string;
      }>
    ) {
      const { index, sceneId } = action.payload;
      if (!state.currentPuzzleId) {
        return;
      }
      const puzzleState = state.puzzleStates[state.currentPuzzleId];
      if (puzzleState) {
        const panel = puzzleState.panels[index];
        if (!panel) {
          console.warn("Panel not found");
          return;
        }
        if (puzzles[state.currentPuzzleId].maxPanelCount <= index) {
          console.warn("Cannot set scene for panel. Index out of bounds.");
          return;
        }
        panel.sceneId = sceneId;
        // Replace assigned characters if the scene changes
        const assignedCharacters = panel.slotAssignedCharacters;
        const oldAssignedCharacters = { ...assignedCharacters };
        panel.slotAssignedCharacters = {};
        Object.values(oldAssignedCharacters).forEach((characterId, index) => {
          panel.slotAssignedCharacters[scenes[sceneId].slots[index].id] = characterId;
        });
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
          // If last panel's sceneId is placeholder, remove it
          if (puzzleState.panels[puzzleState.panels.length - 1].sceneId === placeholder.id) {
            puzzleState.panels.pop();
          } else {
            console.warn("Cannot add more panels. Max panel count reached.");
            return; // Prevent adding the panel
          }
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
      padPanels(state.currentPuzzleId, state.puzzleStates);
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
  setPanelScene,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;

function padPanels(currentPuzzleId: string, puzzleStates: Record<string, PuzzleState>) {
  if (!puzzleStates[currentPuzzleId]) {
    puzzleStates[currentPuzzleId] = { panels: [] };
  }
  const currentPuzzleState = puzzleStates[currentPuzzleId];
  while (currentPuzzleState.panels.length < puzzles[currentPuzzleId].maxPanelCount) {
    currentPuzzleState.panels.push({
      sceneId: placeholder.id,
      slotAssignedCharacters: {},
    });
  }
}
