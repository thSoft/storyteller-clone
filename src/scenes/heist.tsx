import { characters } from "../characters";
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
      state.setDescription(`${robber.name} doesn't want to get his hands dirty.`);
      return;
    }
    if (!state.getState(robber.id, "knowsSecretCode")) {
      state.setDescription(`${robber.name} didn't know the secret code of the safe.`);
      return;
    }
    const previousRobberId = state.getGlobalState("bankRobber")?.id;
    if (previousRobberId !== undefined) {
      state.setDescription(
        `${robber.name} failed to rob the bank because ${characters[previousRobberId]?.name} already robbed it.`
      );
      return;
    }
    state.setGlobalState("bankRobber", robber);
    state.setDescription(`${robber.name} robbed the bank.`);
  },
};
