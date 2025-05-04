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
      const targetNames = targetIds
        .map((id) => characters[id]?.name)
        .filter((name) => name !== undefined)
        .join(", ");
      if (
        !state.areRelated(acceptor.id, "obeys", proposer.id) &&
        state.getRelated(acceptor.id, "impersonates").length === 0
      ) {
        state.addAction({
          type: "thought",
          characterId: proposer.id,
          message: `He will never kill ${targetNames}. I need to find another way.`,
        });
        return;
      }
      state.addRelation(acceptor.id, "promisedMurderTo", proposer.id);
      for (const targetId of targetIds) {
        state.addRelation(acceptor.id, "wantsToKill", targetId);
      }
      let action = {
        type: "speech" as const,
        characterId: proposer.id,
        message: `If you eliminate ${targetNames}, I will promote you!`,
      };
      if (state.getGlobalState("gunOwner")?.id === proposer.id) {
        state.setGlobalState("gunOwner", acceptor);
        state.addAction({
          type: "other",
          characterId: proposer.id,
          action: "giveGun",
        });
        action.message += " Here, take this violin case!";
      } else {
        action.message += " Get a gun!";
      }
      state.addAction(action);
      state.addAction({
        type: "speech",
        characterId: acceptor.id,
        message: "OK, I will do it.",
      });
      return;
    }
    // Order heist
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
    // Join police
    if (state.getState(proposer.id, "worksForPolice")) {
      state.setState(acceptor.id, "worksForPolice", true);
      state.setDescription(`${proposer.name} persuaded ${acceptor.name} to join the police.`);
      return;
    }
  },
};
