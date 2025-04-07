import { edgar, isobel, lenora } from "../characters";
import { kidnap } from "../scenes/kidnap";
import { love } from "../scenes/love";
import { poison } from "../scenes/poison";
import { wine } from "../scenes/wine";
import { initialStoryState } from "../storyState";
import { Puzzle } from "../types";

export const backfire: Puzzle = {
  id: "backfire",
  title: "Backfire",
  prompt: "Heartbreak Due to Fatal Misunderstanding",
  scenes: [love.id, kidnap.id, poison.id, wine.id],
  characters: [edgar.id, lenora.id, isobel.id],
  isWinning: (state) => {
    return (
      state.wineIsPoisonedBy !== undefined &&
      state.heartbroken[state.wineIsPoisonedBy] === true
    );
  },
  initialStoryState: initialStoryState,
};
