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
  currentPuzzleId: Object.keys(puzzles)[0],
  puzzleStates: Object.fromEntries(
    Object.keys(puzzles).map((puzzleId) => [puzzleId, { storyBeats: [] }])
  ),
};

const gameStateSlice = createSlice({
  name: "gameState",
  initialState: initialGameState,
  reducers: {
    setCurrentPuzzleId(state, action: PayloadAction<string>) {
      state.currentPuzzleId = action.payload;
    },
    setSlotCharacter(state, action: PayloadAction<UpdateSlotPayload>) {
      const {
        storyBeatIndex,
        slotId: slot,
        characterId: character,
      } = action.payload;
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
  setSlotCharacter,
  addStoryBeatToCurrentPuzzle,
  removeStoryBeatFromCurrentPuzzle,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
