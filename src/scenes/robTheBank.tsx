import { characters } from "../characters";
import { Scene } from "../types";

const robberSlot = { id: "robber", label: "Robber" };

export const robTheBank: Scene = {
  id: "robTheBank",
  name: "Rob the Bank",
  slots: [robberSlot],
  outcomeLogic: (state, assigned) => {
    const robber = assigned[robberSlot.id];
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
