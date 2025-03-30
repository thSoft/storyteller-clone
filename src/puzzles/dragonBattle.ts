import { dragon, knight, princess } from "../characters";
import { attack } from "../scenes/attack";
import { escape } from "../scenes/escape";
import { initialStoryState } from "../storyState";
import { Puzzle } from "../types";

export const dragonBattle: Puzzle = {
  id: "dragonBattle",
  title: "Dragon Battle",
  prompt: "Dragon Is Defeated And Princess Is Free",
  scenes: [attack.id, escape.id],
  characters: [knight.id, princess.id, dragon.id],
  isWinning: (state) => {
    return state.dead[dragon.id] === true && state.princessIsFree === true;
  },
  initialStoryState: initialStoryState,
};
