import { lucia } from "../characters";
import { love } from "../scenes/love";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { failedHit } from "./failedHit";

export const disownment: Puzzle = {
  id: "disownment",
  title: "Disowned Child",
  prompt: "Disowned Child",
  scenes: [...failedHit.scenes, love.id],
  characters: [...failedHit.characters, lucia.id],
  isWinning: (state) => state.getState(lucia.id, "disowned") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
  dependsOn: failedHit.id,
};
