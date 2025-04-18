import { firebird, jackFrost, neptune } from "../characters";
import { duel } from "../scenes/duel";
import { initialStoryState } from "../storyState";
import { Puzzle } from "../types";

export const elementalBattle: Puzzle = {
  id: "elementalBattle",
  title: "Elemental Battle",
  prompt: "Firebird Remains",
  scenes: [duel.id],
  characters: [firebird.id, jackFrost.id, neptune.id],
  isWinning: (state) => {
    return (
      !state.dead[firebird.id] &&
      state.dead[jackFrost.id] === true &&
      state.dead[neptune.id] === true
    );
  },
  initialStoryState: initialStoryState,
  maxPanelCount: 3,
};
