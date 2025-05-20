import { bruno } from "../characters";
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
  characters: [...successfulHit.characters, bruno.id],
  isWinning: (state) => {
    const robberId = state.getGlobalState("bankRobber")?.id;
    return robberId !== undefined && state.getState(robberId, "rewarded") === true;
  },
  initialStoryState: getInitialStoryState(),
  maxPanelCount: 3,
  dependsOn: [successfulHit.id],
};
