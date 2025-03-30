import { illBoy, miser, poorMan } from "../characters";
import { begging } from "../scenes/begging";
import { death } from "../scenes/death";
import { seance } from "../scenes/seance";
import { initialStoryState } from "../storyState";
import { Puzzle } from "../types";

export const christmasCarol: Puzzle = {
  id: "christmasCarol",
  title: "A Christmas Charol",
  prompt: "A Miser Donates",
  scenes: [begging.id, death.id, seance.id],
  characters: [miser.id, poorMan.id, illBoy.id],
  isWinning: (state) => {
    return (
      state.hasMoney[illBoy.id] === true || state.hasMoney[poorMan.id] === true
    );
  },
  initialStoryState: { ...initialStoryState, hasMoney: { [miser.id]: true } },
};
