import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { puzzles } from "./puzzles";
import { GameState, StoryBeat } from "./types";

const initialGameState: GameState = {
  currentPuzzleId: null,
  currentChapterIndex: 0,
  puzzleStates: Object.fromEntries(
    Object.keys(puzzles).map((puzzleId) => [puzzleId, { storyBeats: [] }])
  ),
};

const gameStateSlice = createSlice({
  name: "gameState",
  initialState: initialGameState,
  reducers: {
    setCurrentPuzzleId(state, action: PayloadAction<string | null>) {
      state.currentPuzzleId = action.payload;
    },
    setCurrentChapterIndex(state, action: PayloadAction<number>) {
      state.currentChapterIndex = action.payload;
    },
    setSlotCharacter(
      state,
      action: PayloadAction<{
        storyBeatIndex: number;
        slotId: string;
        characterId: string;
      }>
    ) {
      const { storyBeatIndex, slotId, characterId } = action.payload;
      if (!state.currentPuzzleId) {
        return;
      }
      const puzzle = state.puzzleStates[state.currentPuzzleId];
      if (puzzle && puzzle.storyBeats[storyBeatIndex]) {
        const assignedCharacters =
          puzzle.storyBeats[storyBeatIndex].slotAssignedCharacters;
        for (const otherSlotId in assignedCharacters) {
          if (assignedCharacters[otherSlotId] === characterId) {
            delete assignedCharacters[otherSlotId];
          }
        }
        assignedCharacters[slotId] = characterId;
      }
    },
    addStoryBeatToCurrentPuzzle(
      state,
      action: PayloadAction<{
        index: number;
        beat: StoryBeat;
      }>
    ) {
      const { index, beat } = action.payload;
      if (!state.currentPuzzleId) {
        return;
      }
      const puzzle = state.puzzleStates[state.currentPuzzleId];
      if (puzzle) {
        puzzle.storyBeats.splice(index, 0, beat);
      }
    },
    removeStoryBeatFromCurrentPuzzle(
      state,
      action: PayloadAction<{ index: number }>
    ) {
      const { index } = action.payload;
      if (!state.currentPuzzleId) {
        return;
      }
      const puzzle = state.puzzleStates[state.currentPuzzleId];
      if (puzzle && index >= 0 && index < puzzle.storyBeats.length) {
        puzzle.storyBeats.splice(index, 1);
      }
    },
  },
});

export const {
  setCurrentPuzzleId,
  setCurrentChapterIndex,
  setSlotCharacter,
  addStoryBeatToCurrentPuzzle,
  removeStoryBeatFromCurrentPuzzle,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
