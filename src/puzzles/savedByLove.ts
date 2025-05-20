import { alessio, lucia, mafiaCharacters } from "../characters";
import { mafiaScenes } from "../scenes";
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
  dependsOn: vincenzoTakesOver.id,
};
