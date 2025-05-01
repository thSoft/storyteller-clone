import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

export const robberSlot = { id: "robber", label: "Robber" };
export const heist: Scene = {
  id: "heist",
  name: "💰 Heist",
  slots: [robberSlot],
  outcomeLogic: (state, assigned) => {
    const robber = assigned[robberSlot.id];
    if (handlePreconditions(state, robber)) return;
    if (state.getState(robber.id, "doesNotSteal")) {
      state.setGlobalState("event", `${robber.name} doesn't want to get his hands dirty.`);
      return;
    }
    if (!state.getState(robber.id, "knowsSecretCode")) {
      state.setGlobalState("event", `${robber.name} didn't know the secret code of the safe.`);
      return;
    }
    state.setGlobalState("bankRobber", robber);
    state.setGlobalState("event", `${robber.name} robbed the bank.`);
  },
};
