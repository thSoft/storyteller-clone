import { butler, duchess, duke } from "../characters";
import { ballroom } from "../scenes/ballroom";
import { gun } from "../scenes/gun";
import { safe } from "../scenes/safe";
import { initialStoryState } from "../storyState";
import { Puzzle } from "../types";

export const heist: Puzzle = {
  id: "heist",
  title: "Heist",
  prompt: "Thief Steals Money",
  scenes: [ballroom.id, gun.id, safe.id],
  characters: [duke.id, duchess.id, butler.id],
  isWinning: (state) => state.hasMoney[butler.id],
  initialStoryState: {
    ...initialStoryState,
    hasMoney: { [duke.id]: true },
    knowsCodeOfSafe: { [duke.id]: true },
  },
};
