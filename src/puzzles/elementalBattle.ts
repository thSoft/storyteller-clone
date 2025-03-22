import { firebird, jackFrost, neptune } from "../characters";
import { duel } from "../scenes";
import { initialStoryState, Puzzle } from "../types";

export const elementalBattle: Puzzle = {
  id: "elementalBattle",
  title: "Elemental Battle",
  prompt: "Firebird Remains",
  scenes: [duel.id],
  characters: [firebird.id, jackFrost.id, neptune.id],
  isWinning: (state) => {
    return (
      !state.defeated[firebird.id] &&
      state.defeated[jackFrost.id] === true &&
      state.defeated[neptune.id] === true
    );
  },
  initialStoryState: initialStoryState,
};
