import { adam, eve } from "../characters";
import { death, love } from "../sceneTemplates";
import { Puzzle, StoryState } from "../types";

function isWinning(state: StoryState) {
  const eveStates = state.characterStates[eve.id];
  return eveStates?.has("dead") && eveStates?.has("heartbroken");
}

const initialStoryState: StoryState = {
  characterStates: {},
  loveRelationships: new Set(),
  event: "",
};

export const eveDiesHeartbroken: Puzzle = {
  id: "Eve Dies Heartbroken",
  title: "Eve Dies Heartbroken",
  characters: [adam.id, eve.id],
  sceneTemplates: [love.id, death.id],
  isWinning: isWinning,
  initialStoryState: initialStoryState,
};
