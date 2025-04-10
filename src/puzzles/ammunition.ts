import { grandma, hunter, red, wolf } from "../characters";
import { forest } from "../scenes/forest";
import { grandmasHouse } from "../scenes/grandmasHouse";
import { moon } from "../scenes/moon";
import { initialStoryState } from "../storyState";
import { Puzzle } from "../types";

export const ammunition: Puzzle = {
  id: "ammunition",
  title: "Ammunition",
  prompt: `Both ${hunter.name} And ${wolf.name} Die`,
  scenes: [forest.id, grandmasHouse.id, moon.id],
  characters: [red.id, wolf.id, grandma.id, hunter.id],
  isWinning: (state) => state.dead[wolf.id] && state.dead[hunter.id],
  initialStoryState: initialStoryState,
  maxPanelCount: 4,
};
