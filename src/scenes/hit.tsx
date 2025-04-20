import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

export const shooterSlot = { id: "shooter", label: "Shooter" };
export const targetSlot = { id: "target", label: "Target" };
export const hit: Scene = {
  id: "hit",
  name: "🔫 Hit",
  slots: [shooterSlot, targetSlot],
  outcomeLogic: (state, assigned) => {
    const shooter = assigned[shooterSlot.id];
    const target = assigned[targetSlot.id];
    if (!shooter || !target) return;
    if (handlePreconditions(state, shooter, target)) return;
    if (!state.wantsToKill[shooter.id].includes(target.id)) {
      state.event = `${shooter.name} didn't want to kill ${target.name}.`;
      return;
    }
    if (state.doesNotKill[shooter.id]) {
      state.event = `${shooter.name} doesn't want to get his hands dirty.`;
      return;
    }
    if (state.personWithGun !== shooter.id) {
      state.event = `${shooter.name} doesn't have a gun.`;
      return;
    }
    state.dead[target.id] = true;
    state.event = `${shooter.name} shot ${target.name}.`;
  },
};
