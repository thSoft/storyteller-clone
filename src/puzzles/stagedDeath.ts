import { alessio, donMarcello, mafiaCharacters, vincenzo } from "../characters";
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
  isWinning: (state) => mafiaCharacters.some((characterId) => state.getState(characterId, "shockedByAlive") === true),
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
  dependsOn: [outsmarted.id],
  solutions: [
    [
      panel(orderHit, donMarcello, vincenzo),
      panel(wearArmor, alessio),
      panel(shoot, vincenzo, alessio),
      panel(disclose, alessio, vincenzo),
    ],
  ],
};
