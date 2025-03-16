import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { puzzles } from "./puzzles";
import { GameState, StoryBeat } from "./types";

type UpdateSlotPayload = {
  storyBeatIndex: number;
  slotId: string;
  characterId: string;
};

type AddStoryBeatPayload = {
  index: number;
  beat: StoryBeat;
};

type RemoveStoryBeatPayload = {
  index: number;
};

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
    setCurrentChapterIndex: (state, action: PayloadAction<number>) => {
      state.currentChapterIndex = action.payload;
    },
    setSlotCharacter(state, action: PayloadAction<UpdateSlotPayload>) {
      const {
        storyBeatIndex,
        slotId: slot,
        characterId: character,
      } = action.payload;
      if (!state.currentPuzzleId) {
        return;
      }
      const puzzle = state.puzzleStates[state.currentPuzzleId];
      if (puzzle && puzzle.storyBeats[storyBeatIndex]) {
        puzzle.storyBeats[storyBeatIndex].slotAssignedCharacters[slot] =
          character;
      }
    },
    addStoryBeatToCurrentPuzzle(
      state,
      action: PayloadAction<AddStoryBeatPayload>
    ) {
      if (!state.currentPuzzleId) {
        return;
      }
      const { index, beat } = action.payload;
      const puzzle = state.puzzleStates[state.currentPuzzleId];
      if (puzzle) {
        puzzle.storyBeats.splice(index, 0, beat);
      }
    },
    removeStoryBeatFromCurrentPuzzle(
      state,
      action: PayloadAction<RemoveStoryBeatPayload>
    ) {
      if (!state.currentPuzzleId) {
        return;
      }
      const { index } = action.payload;
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
