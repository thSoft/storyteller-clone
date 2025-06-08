import { bruno, donRomano, mafiaCharacters, vincenzo } from "../characters";
import { panel } from "../panelUtil";
import { mafiaScenes } from "../scenes";
import { disclose } from "../scenes/disclose";
import { eavesdrop } from "../scenes/eavesdrop";
import { orderHeist } from "../scenes/orderHeist";
import { robTheBank } from "../scenes/robTheBank";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { vincenzoTakesOver } from "./vincenzoTakesOver";

export const failedHeist: Puzzle = {
  id: "failedHeist",
  title: "Failed Heist",
  prompt: "Fired for Failed Heist",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) =>
    state.getGlobalState("bankRobber")?.id === vincenzo.id && state.getState(bruno.id, "fired") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 5,
  dependsOn: [vincenzoTakesOver.id],
  solutions: [
    [
      panel(eavesdrop, vincenzo),
      panel(orderHeist, donRomano, bruno),
      panel(robTheBank, vincenzo),
      panel(robTheBank, bruno),
      panel(disclose, bruno, donRomano),
    ],
  ],
  invalidSolutions: [[]],
};
