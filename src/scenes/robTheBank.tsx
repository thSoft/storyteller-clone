import { Scene } from "../types";

const robberSlot = { id: "robber", label: "Robber" };

export const robTheBank: Scene = {
  id: "robTheBank",
  name: "Rob the Bank",
  color: "#B74F3D",
  slots: [robberSlot],
  outcomeLogic: (state, assigned) => {
    const robber = assigned[robberSlot.id];
    if (state.getState(robber.id, "doesNotSteal")) {
      state.think(robber.id, `I don't want to get my hands dirty.`);
      return;
    }
    if (!state.getState(robber.id, "knowsSecretCode")) {
      state.think(robber.id, `I don't know the secret code of the safe.`);
      state.addAction({
        type: "thought",
        characterId: robber.id,
        message: "What could be the secret code?",
      });
      return;
    }
    const previousRobberId = state.getGlobalState("bankRobber")?.id;
    if (previousRobberId !== undefined) {
      state.think(robber.id, `Someone else already robbed the bank!`);
      return;
    }
    state.setGlobalState("bankRobber", robber);
    state.act(robber.id, "robTheBank");
    state.think(robber.id, `🤑`);
  },
};
