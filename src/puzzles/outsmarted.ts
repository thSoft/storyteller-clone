import { bruno, donMarcello, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { impersonate } from "../scenes/impersonate";
import { orderHit } from "../scenes/orderHit";
import { showGun } from "../scenes/showGun";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { arrestedForMurder } from "./arrestedForMurder";

export const outsmarted: Puzzle = {
  id: "outsmarted",
  title: "Outsmarted",
  prompt: "Shocked by Gun in Rival's Hands",
  scenes: [...arrestedForMurder.scenes, impersonate.id, showGun.id],
  characters: [...arrestedForMurder.characters],
  isWinning: (state) => state.getState(donMarcello.id, "shockedByGun") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
  dependsOn: [arrestedForMurder.id],
  solutions: [
    [
      panel(impersonate, bruno, vincenzo),
      panel(orderHit, donMarcello, bruno),
      panel(impersonate, bruno),
      panel(showGun, bruno, donMarcello),
    ],
  ],
};
