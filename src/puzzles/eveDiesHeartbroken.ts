import { Puzzle, StoryState } from "../types";

// Puzzle
const title = "Eve Dies Heartbroken";
function isWinning(state: StoryState) {
  const eveStates = state.characterStates["eve"];
  return eveStates?.has("dead") && eveStates?.has("heartbroken");
}
const initialStoryState: StoryState = {
  characterStates: {},
  loveRelationships: new Set(),
  event: "",
};
export const eveDiesHeartbroken: Puzzle = {
  id: "Eve Dies Heartbroken",
  title: title,
  characters: ["adam", "eve"],
  sceneTemplates: ["love", "death"],
  isWinning: isWinning,
  initialStoryState: initialStoryState,
};
