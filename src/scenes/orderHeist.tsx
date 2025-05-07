import { Scene } from "../types";

const proposerSlot = { id: "proposer", label: "Proposer" };
const acceptorSlot = { id: "acceptor", label: "Acceptor" };

export const orderHeist: Scene = {
  id: "orderHeist",
  name: "Order Heist",
  slots: [proposerSlot, acceptorSlot],
  outcomeLogic: (state, assigned) => {
    const proposer = assigned[proposerSlot.id];
    const acceptor = assigned[acceptorSlot.id];
    if (state.getState(proposer.id, "knowsSecretCode")) {
      if (!state.areRelated(acceptor.id, "obeys", proposer.id)) {
        state.think(proposer.id, `He will never rob the bank. I need to find another way.`);
        return;
      }
      state.setStates([acceptor.id, state.getGlobalState("eavesdropper")?.id], "knowsSecretCode", true);
      state.addRelation(acceptor.id, "promisedHeistTo", proposer.id);
      state.say(proposer.id, `If you rob the bank, I will promote you!`);
      state.say(acceptor.id, `OK, I will do it.`);
      return;
    }
  },
};
