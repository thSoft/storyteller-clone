import { donMarcello } from "../characters";
import { getState } from "../scenes/sceneUtils";
import { shield } from "../scenes/shield";
import { getInitialStoryState } from "../storyState";
import { Puzzle } from "../types";
import { outsmarted } from "./outsmarted";

export const stagedDeath: Puzzle = {
  id: "stagedDeath",
  title: "Staged Death",
  prompt: "Seeing a Living Ghost",
  scenes: [...outsmarted.scenes, shield.id],
  characters: [...outsmarted.characters],
  isWinning: (state) => getState(state, donMarcello.id, "shockedByAlive") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 5,
};
