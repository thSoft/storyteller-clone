import { alessio, donMarcello, lucia } from "../characters";
import { panel } from "../panelUtil";
import { disclose } from "../scenes/disclose";
import { disown } from "../scenes/disown";
import { eavesdrop } from "../scenes/eavesdrop";
import { fallInLove } from "../scenes/fallInLove";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { stagedDeath } from "./stagedDeath";

export const disownment: Puzzle = {
  id: "disownment",
  title: "Disowned Child",
  prompt: "Disowned Child",
  scenes: [...stagedDeath.scenes, fallInLove.id, disown.id],
  characters: [...stagedDeath.characters, lucia.id],
  isWinning: (state) => state.getState(lucia.id, "disowned") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
  dependsOn: [stagedDeath.id],
  solutions: [
    [panel(eavesdrop, donMarcello), panel(fallInLove, lucia, alessio), panel(disown, donMarcello, lucia)],
    [panel(eavesdrop, donMarcello), panel(fallInLove, alessio, lucia), panel(disown, donMarcello, lucia)],
    [panel(fallInLove, lucia, alessio), panel(disclose, lucia, donMarcello), panel(disown, donMarcello, lucia)],
    [panel(fallInLove, lucia, alessio), panel(disclose, alessio, donMarcello), panel(disown, donMarcello, lucia)],
  ],
  invalidSolutions: [[]],
};
