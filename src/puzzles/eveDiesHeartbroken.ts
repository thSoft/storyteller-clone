import { adam, eve } from "../characters";
import { death, love } from "../scenes";
import { initialStoryState, Puzzle } from "../types";

export const eveDiesHeartbroken: Puzzle = {
  id: "Eve Dies Heartbroken",
  title: "Eve Dies Heartbroken",
  characters: [adam.id, eve.id],
  scenes: [love.id, death.id],
  isWinning: (state) => {
    return state.dead[eve.id] === true && state.heartbroken[eve.id] === true;
  },
  initialStoryState: initialStoryState,
};
