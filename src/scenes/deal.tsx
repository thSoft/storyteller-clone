import { characters } from "../characters";
import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

export const ordererSlot = { id: "orderer", label: "Orderer" };
export const executorSlot = { id: "executor", label: "Executor" };
export const deal: Scene = {
  id: "deal",
  name: "🤝 Deal",
  slots: [ordererSlot, executorSlot],
  outcomeLogic: (state, assigned) => {
    const orderer = assigned[ordererSlot.id];
    const executor = assigned[executorSlot.id];
    if (handlePreconditions(state, orderer, executor)) return;
    const targetIds = state.getRelated(orderer.id, "wantsToKill");
    // Order hit
    if (targetIds.length > 0) {
      if (!state.areRelated(executor.id, "obeys", orderer.id)) {
        state.setGlobalState("event", `${executor.name} doesn't obey ${orderer.name}.`);
        return;
      }
      state.addRelation(executor.id, "promisedMurderTo", orderer.id);
      for (const targetId of targetIds) {
        state.addRelation(executor.id, "wantsToKill", targetId);
      }
      const targetNames = targetIds
        .map((id) => characters[id]?.name)
        .filter((name) => name !== undefined)
        .join(", ");
      let event = `${orderer.name} ordered ${executor.name} to kill ${targetNames} `;
      if (state.getGlobalState("gunOwner")?.id === orderer.id) {
        state.setGlobalState("gunOwner", executor);
        event += "and handed him a gun in a violin case.";
      } else {
        event += "and told him to get a gun.";
      }
      state.setGlobalState("event", event);
      return;
    }
    // Order heist
    if (state.getState(orderer.id, "knowsSecretCode")) {
      if (!state.areRelated(executor.id, "obeys", orderer.id)) {
        state.setGlobalState("event", `${executor.name} doesn't obey ${orderer.name}.`);
        return;
      }
      state.setStates([executor.id, state.getGlobalState("eavesdropper")?.id], "knowsSecretCode", true);
      state.addRelation(executor.id, "promisedHeistTo", orderer.id);
      state.setGlobalState(
        "event",
        `${orderer.name} ordered ${executor.name} to rob the bank and told him the secret code of the safe.`
      );
      return;
    }
    // Join police
    if (state.getState(orderer.id, "worksForPolice")) {
      state.setState(executor.id, "worksForPolice", true);
      state.setGlobalState("event", `${orderer.name} persuaded ${executor.name} to join the police.`);
      return;
    }
  },
};
