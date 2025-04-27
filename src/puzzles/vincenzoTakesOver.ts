import { mafiaCharacters, vincenzo } from "../characters";
import { mafiaScenes } from "../scenes";
import { getState } from "../scenes/sceneUtils";
import { getInitialStoryState } from "../storyState";
import { Puzzle } from "../types";

export const vincenzoTakesOver: Puzzle = {
  id: "vincenzoTakesOver",
  title: "Takeover",
  prompt: "Vincenzo Overtakes the Family",
  scenes: mafiaScenes,
  characters: mafiaCharacters,
  isWinning: (state) => getState(state, vincenzo.id, "headOfFamily") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
};
