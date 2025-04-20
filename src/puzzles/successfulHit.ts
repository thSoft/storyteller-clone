import { alessio, donMarcello, donRomano, vincenzo } from "../characters";
import { deal } from "../scenes/deal";
import { hit } from "../scenes/hit";
import { initialStoryState } from "../storyState";
import { Puzzle } from "../types";

export const successfulHit: Puzzle = {
  id: "successfulHit",
  title: "Successful Hit",
  prompt: `A Successful Hit`,
  scenes: [deal.id, hit.id],
  characters: [donMarcello.id, vincenzo.id, donRomano.id, alessio.id],
  isWinning: (state) => state.dead[alessio.id],
  initialStoryState: initialStoryState,
  maxPanelCount: 3,
};
