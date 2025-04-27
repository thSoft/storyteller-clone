import { lucia } from "../characters";
import { love } from "../scenes/love";
import { getState } from "../scenes/sceneUtils";
import { getInitialStoryState } from "../storyState";
import { Puzzle } from "../types";
import { failedHit } from "./failedHit";

export const disownment: Puzzle = {
  id: "disownment",
  title: "Disownment",
  prompt: "Disowned Child",
  scenes: [...failedHit.scenes, love.id],
  characters: [...failedHit.characters, lucia.id],
  isWinning: (state) => getState(state, lucia.id, "disowned") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
};
