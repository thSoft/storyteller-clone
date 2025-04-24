import { Scene } from "../types";
import { areRelated, getState, handlePreconditions, setState } from "./sceneUtils";

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
    if (!areRelated(state, shooter.id, "wantsToKill", target.id)) {
      state.event = `${shooter.name} didn't want to kill ${target.name}.`;
      return;
    }
    if (getState(state, shooter.id, "doesNotKill")) {
      state.event = `${shooter.name} doesn't want to get his hands dirty.`;
      return;
    }
    if (state.graph.getAttribute("personWithGun") !== shooter.id) {
      state.event = `${shooter.name} didn't have a gun.`;
      return;
    }
    setState(state, target.id, "dead", true);
    setState(state, shooter.id, "awareOf", {
      type: "killed",
      killerId: shooter.id,
      victimId: target.id,
    });
    state.event = `${shooter.name} shot ${target.name}.`;
  },
};
