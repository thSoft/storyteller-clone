import { alessio, donMarcello, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { disclose } from "../scenes/disclose";
import { orderHit } from "../scenes/orderHit";
import { shoot } from "../scenes/shoot";
import { wearArmor } from "../scenes/wearArmor";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { outsmarted } from "./outsmarted";

export const stagedDeath: Puzzle = {
  id: "stagedDeath",
  title: "Staged Death",
  prompt: "Seeing a Living Ghost",
  scenes: [...outsmarted.scenes, wearArmor.id],
  characters: [...outsmarted.characters],
  isWinning: (state) => state.getState(donMarcello.id, "shockedByAlive") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 5,
  dependsOn: [outsmarted.id],
  solutions: [
    [
      panel(orderHit, donMarcello, vincenzo),
      panel(wearArmor, alessio),
      panel(shoot, vincenzo, alessio),
      panel(disclose, vincenzo, donMarcello),
      panel(disclose, alessio, donMarcello),
    ],
  ],
};
