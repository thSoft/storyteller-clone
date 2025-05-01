import { alessio, donMarcello, donRomano, vincenzo } from "../characters";
import { deal } from "../scenes/deal";
import { disclose } from "../scenes/disclose";
import { hit } from "../scenes/hit";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";

export const successfulHit: Puzzle = {
  id: "successfulHit",
  title: "Successful Hit",
  prompt: "Promotion for Successful Hit",
  scenes: [deal.id, hit.id, disclose.id],
  characters: [donMarcello.id, vincenzo.id, donRomano.id, alessio.id],
  isWinning: (state) => state.getState(alessio.id, "dead") === true && state.getState(vincenzo.id, "promoted") === true,
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
};
