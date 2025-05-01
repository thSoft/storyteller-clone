import { bruno, mafiaCharacters, vincenzo } from "../characters";
import { mafiaScenes } from "../scenes";
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
  maxPanelCount: 6,
  dependsOn: vincenzoTakesOver.id,
};
