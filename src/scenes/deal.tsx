import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

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
    if (!orderer || !executor || !target) return;
    if (handlePreconditions(state, orderer, executor)) return;
    if (!state.wantsToKill[orderer.id].includes(target.id)) {
      state.event = `${orderer.name} doesn't want to kill ${target.name}.`;
      return;
    }
    state.wantsToKill[executor.id] = state.wantsToKill[executor.id]
      ? [...state.wantsToKill[executor.id], target.id]
      : [target.id];
    if (state.personWithGun !== orderer.id) {
      state.event = `${orderer.name} ordered ${executor.name} to kill ${target.name} and told him to get a gun.`;
      return;
    }
    state.personWithGun = executor.id;
    state.event = `${orderer.name} ordered ${executor.name} to kill ${target.name} and handed him a gun in a violin case.`;
  },
};
