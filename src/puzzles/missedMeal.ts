import { grandma, hunter, red, wolf } from "../characters";
import { forest } from "../scenes/forest";
import { grandmasHouse } from "../scenes/grandmasHouse";
import { moon } from "../scenes/moon";
import { initialStoryState } from "../storyState";
import { Puzzle } from "../types";

export const missedMeal: Puzzle = {
  id: "missedMeal",
  title: "Missed Meal",
  prompt: `${wolf.name} Arrives Late to the Party`,
  scenes: [forest.id, grandmasHouse.id, moon.id],
  characters: [red.id, wolf.id, grandma.id, hunter.id],
  isWinning: (state) => state.disappointed[wolf.id],
  initialStoryState: initialStoryState,
  maxPanelCount: 4,
};
