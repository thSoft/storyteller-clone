import { characters } from "../characters";
import { Scene } from "../types";
import {
  addRelation,
  areRelated,
  getEavesdropperId,
  getRelated,
  getState,
  handlePreconditions,
  setState,
  setStates,
} from "./sceneUtils";

export const ordererSlot = { id: "orderer", label: "Orderer" };
export const executorSlot = { id: "executor", label: "Executor" };
export const deal: Scene = {
  id: "deal",
  name: "🤝 Deal",
  slots: [ordererSlot, executorSlot],
  outcomeLogic: (state, assigned) => {
    const orderer = assigned[ordererSlot.id];
    const executor = assigned[executorSlot.id];
    if (!orderer || !executor) return;
    if (handlePreconditions(state, orderer, executor)) return;
    const targetIds = getRelated(state, orderer.id, "wantsToKill");
    // Order hit
    if (targetIds.length > 0) {
      if (!areRelated(state, executor.id, "obeys", orderer.id)) {
        state.event = `${executor.name} doesn't obey ${orderer.name}.`;
        return;
      }
      for (const targetId of targetIds) {
        addRelation(state, executor.id, "wantsToKill", targetId);
      }
      const targetNames = targetIds
        .map((id) => characters[id]?.name)
        .filter((name) => name !== undefined)
        .join(", ");
      if (state.graph.getAttribute("personWithGun") === orderer.id) {
        state.graph.setAttribute("personWithGun", executor.id);
        state.event = `${orderer.name} ordered ${executor.name} to kill ${targetNames} and handed him a gun in a violin case.`;
      } else {
        state.event = `${orderer.name} ordered ${executor.name} to kill ${targetNames} and told him to get a gun.`;
      }
      handleDealClosed();
    }
    // Order heist
    if (getState(state, orderer.id, "knowsSecretCode")) {
      if (!areRelated(state, executor.id, "obeys", orderer.id)) {
        state.event = `${executor.name} doesn't obey ${orderer.name}.`;
        return;
      }
      setStates(state, [executor.id, getEavesdropperId(state)], "knowsSecretCode", true);
      state.event = `${orderer.name} ordered ${executor.name} to rob the bank and told him the secret code of the safe.`;
      handleDealClosed();
    }
    // Join police
    if (getState(state, orderer.id, "worksForPolice")) {
      setState(state, executor.id, "worksForPolice", true);
      state.event = `${orderer.name} persuaded ${executor.name} to join the police.`;
      handleDealClosed();
    }

    function handleDealClosed() {
      addRelation(state, executor.id, "isBoundByDealWith", orderer.id);
      setState(state, getEavesdropperId(state), "awareOf", {
        type: "deal",
        ordererId: orderer.id,
        executorId: executor.id,
      });
    }
  },
};
