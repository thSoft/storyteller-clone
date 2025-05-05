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
        state.setDescription(`${acceptor.name} doesn't obey ${proposer.name}.`);
        return;
      }
      state.setStates([acceptor.id, state.getGlobalState("eavesdropper")?.id], "knowsSecretCode", true);
      state.addRelation(acceptor.id, "promisedHeistTo", proposer.id);
      state.setDescription(
        `${proposer.name} ordered ${acceptor.name} to rob the bank and told him the secret code of the safe.`
      );
      return;
    }
  },
};
