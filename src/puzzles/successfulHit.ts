import { alessio, donMarcello, donRomano, vincenzo } from "../characters";
import { deal } from "../scenes/deal";
import { disclose } from "../scenes/disclose";
import { hit } from "../scenes/hit";
import { getState } from "../scenes/sceneUtils";
import { getInitialStoryState } from "../storyState";
import { Puzzle } from "../types";

export const successfulHit: Puzzle = {
  id: "successfulHit",
  title: "Successful Hit",
  prompt: `A Successful Hit`,
  scenes: [deal.id, hit.id, disclose.id],
  characters: [donMarcello.id, vincenzo.id, donRomano.id, alessio.id],
  isWinning: (state) =>
    getState(state, alessio.id, "dead") === true && getState(state, donMarcello.id, "content") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
};
