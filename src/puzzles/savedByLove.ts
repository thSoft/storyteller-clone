import { alessio, donMarcello, lucia, mafiaCharacters, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { mafiaScenes } from "../scenes";
import { fallInLove } from "../scenes/fallInLove";
import { impersonate } from "../scenes/impersonate";
import { orderHit } from "../scenes/orderHit";
import { shoot } from "../scenes/shoot";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const savedByLove: Puzzle = {
  id: "savedByLove",
  title: "Saved by Love",
  prompt: "Saved by Love",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) => state.getState(lucia.id, "dead") === true && !state.getState(alessio.id, "dead"),
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 4,
  dependsOn: [vincenzoTakesOver.id],
  solutions: [
    [
      panel(fallInLove, lucia, alessio),
      panel(orderHit, donMarcello, vincenzo),
      panel(impersonate, lucia, alessio),
      panel(shoot, vincenzo, lucia),
    ],
  ],
  invalidSolutions: [[]],
};
