import { characters } from "../characters";
import { Scene } from "../types";

const proposerSlot = { id: "proposer", label: "Proposer" };
const acceptorSlot = { id: "acceptor", label: "Acceptor" };

export const orderHit: Scene = {
  id: "orderHit",
  name: "Order Hit",
  slots: [proposerSlot, acceptorSlot],
  outcomeLogic: (state, assigned) => {
    const proposer = assigned[proposerSlot.id];
    const acceptor = assigned[acceptorSlot.id];
    const targetIds = state.getRelated(proposer.id, "wantsToKill");
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
        action.message += " Now go, get a gun!";
      }
      state.addAction(action);
      state.addAction({
        type: "speech",
        characterId: acceptor.id,
        message: "OK, I will do it.",
      });
      return;
    }
  },
};
