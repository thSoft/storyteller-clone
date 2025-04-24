import { Scene } from "../types";
import { addRelation, areRelated, handlePreconditions, setState } from "./sceneUtils";

export const ordererSlot = { id: "orderer", label: "Orderer" };
export const executorSlot = { id: "executor", label: "Executor" };
export const targetSlot = { id: "target", label: "Target" };
export const deal: Scene = {
  id: "deal",
  name: "🤝 Deal",
  slots: [ordererSlot, executorSlot, targetSlot],
  outcomeLogic: (state, assigned) => {
    const orderer = assigned[ordererSlot.id];
    const executor = assigned[executorSlot.id];
    const target = assigned[targetSlot.id];
    if (!orderer || !executor) return;
    if (handlePreconditions(state, orderer, executor)) return;
    if (!areRelated(state, executor.id, "obeys", orderer.id)) {
      state.event = `${executor.name} doesn't obey ${orderer.name}.`;
      return;
    }
    if (target === undefined) {
      setState(state, executor.id, "knowsSecretCode", true);
      addRelation(state, executor.id, "isBoundByDealWith", orderer.id);
      state.event = `${orderer.name} ordered ${executor.name} to rob the bank and told him the secret code of the safe.`;
    } else {
      if (!areRelated(state, orderer.id, "wantsToKill", target.id)) {
        state.event = `${orderer.name} doesn't want to kill ${target.name}.`;
        return;
      }
      addRelation(state, executor.id, "wantsToKill", target.id);
      if (state.graph.getAttribute("personWithGun") !== orderer.id) {
        state.event = `${orderer.name} ordered ${executor.name} to kill ${target.name} and told him to get a gun.`;
        return;
      }
      state.graph.setAttribute("personWithGun", executor.id);
      addRelation(state, executor.id, "isBoundByDealWith", orderer.id);
      state.event = `${orderer.name} ordered ${executor.name} to kill ${target.name} and handed him a gun in a violin case.`;
    }
  },
};
