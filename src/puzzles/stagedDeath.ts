import { donMarcello } from "../characters";
import { getState } from "../scenes/sceneUtils";
import { shield } from "../scenes/shield";
import { getInitialStoryState } from "../storyState";
import { Puzzle } from "../types";
import { disownment } from "./disownedChild";

export const stagedDeath: Puzzle = {
  id: "stagedDeath",
  title: "Staged Death",
  prompt: "Seeing a Living Ghost",
  scenes: [...disownment.scenes, shield.id],
  characters: [...disownment.characters],
  isWinning: (state) => getState(state, donMarcello.id, "shocked") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 5,
};
