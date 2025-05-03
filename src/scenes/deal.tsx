import { characters } from "../characters";
import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

export const proposerSlot = { id: "proposer", label: "Proposer" };
export const acceptorSlot = { id: "acceptor", label: "Acceptor" };
export const deal: Scene = {
  id: "deal",
  name: "🤝 Deal",
  slots: [proposerSlot, acceptorSlot],
  outcomeLogic: (state, assigned) => {
    const proposer = assigned[proposerSlot.id];
    const acceptor = assigned[acceptorSlot.id];
    if (handlePreconditions(state, proposer, acceptor)) return;
    const targetIds = state.getRelated(proposer.id, "wantsToKill");
    // Order hit
    if (targetIds.length > 0) {
      if (
        !state.areRelated(acceptor.id, "obeys", proposer.id) &&
        state.getRelated(acceptor.id, "impersonates").length === 0
      ) {
        state.setGlobalState("event", `${acceptor.name} doesn't obey ${proposer.name}.`);
        return;
      }
      state.addRelation(acceptor.id, "promisedMurderTo", proposer.id);
      for (const targetId of targetIds) {
        state.addRelation(acceptor.id, "wantsToKill", targetId);
      }
      const targetNames = targetIds
        .map((id) => characters[id]?.name)
        .filter((name) => name !== undefined)
        .join(", ");
      let event = `${proposer.name} ordered ${acceptor.name} to kill ${targetNames} `;
      if (state.getGlobalState("gunOwner")?.id === proposer.id) {
        state.setGlobalState("gunOwner", acceptor);
        event += "and handed him/her a gun in a violin case.";
      } else {
        event += "and told him/her to get a gun.";
      }
      state.setGlobalState("event", event);
      return;
    }
    // Order heist
    if (state.getState(proposer.id, "knowsSecretCode")) {
      if (!state.areRelated(acceptor.id, "obeys", proposer.id)) {
        state.setGlobalState("event", `${acceptor.name} doesn't obey ${proposer.name}.`);
        return;
      }
      state.setStates([acceptor.id, state.getGlobalState("eavesdropper")?.id], "knowsSecretCode", true);
      state.addRelation(acceptor.id, "promisedHeistTo", proposer.id);
      state.setGlobalState(
        "event",
        `${proposer.name} ordered ${acceptor.name} to rob the bank and told him the secret code of the safe.`
      );
      return;
    }
    // Join police
    if (state.getState(proposer.id, "worksForPolice")) {
      state.setState(acceptor.id, "worksForPolice", true);
      state.setGlobalState("event", `${proposer.name} persuaded ${acceptor.name} to join the police.`);
      return;
    }
  },
};
