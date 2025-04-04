import { grandma, hunter, red, wolf } from "../characters";
import { forest } from "../scenes/forest";
import { grandmasHouse } from "../scenes/grandmasHouse";
import { initialStoryState } from "../storyState";
import { Puzzle } from "../types";

export const sacrifice: Puzzle = {
  id: "sacrifice",
  title: "Sacrifice",
  prompt: `Only ${red.name} Dies`,
  scenes: [forest.id, grandmasHouse.id],
  characters: [red.id, wolf.id, grandma.id, hunter.id],
  isWinning: (state) =>
    state.dead[red.id] &&
    !state.dead[wolf.id] &&
    !state.dead[grandma.id] &&
    !state.dead[hunter.id],
  initialStoryState: initialStoryState,
};
