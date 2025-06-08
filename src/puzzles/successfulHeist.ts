import { alessio, bruno, donRomano } from "../characters";
import { panel } from "../panelUtil";
import { disclose } from "../scenes/disclose";
import { orderHeist } from "../scenes/orderHeist";
import { robTheBank } from "../scenes/robTheBank";
import { getInitialStoryState } from "../stateProxy";
import { Puzzle } from "../types";
import { successfulHit } from "./successfulHit";

export const successfulHeist: Puzzle = {
  id: "successfulHeist",
  title: "Successful Heist",
  prompt: "Robber Gets His Cut",
  scenes: [...successfulHit.scenes, orderHeist.id, robTheBank.id],
  characters: [...successfulHit.characters, donRomano.id, bruno.id],
  isWinning: (state) => {
    const robberId = state.getGlobalState("bankRobber")?.id;
    return robberId !== undefined && state.getState(robberId, "rewarded") === true;
  },
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
  dependsOn: [successfulHit.id],
  solutions: [
    [panel(orderHeist, donRomano, bruno), panel(robTheBank, bruno), panel(disclose, bruno, donRomano)],
    [panel(orderHeist, donRomano, alessio), panel(robTheBank, alessio), panel(disclose, alessio, donRomano)],
  ],
};
