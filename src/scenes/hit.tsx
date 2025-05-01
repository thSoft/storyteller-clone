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
    if (handlePreconditions(state, shooter, target)) return;
    if (!state.areRelated(shooter.id, "wantsToKill", target.id)) {
      state.setGlobalState("event", `${shooter.name} didn't want to kill ${target.name}.`);
      return;
    }
    if (state.getState(shooter.id, "doesNotKill")) {
      state.setGlobalState("event", `${shooter.name} doesn't want to get his hands dirty.`);
      return;
    }
    if (state.getGlobalState("gunOwner")?.id !== shooter.id) {
      state.setGlobalState("event", `${shooter.name} didn't have a gun.`);
      return;
    }
    let event = `${shooter.name} shot ${target.name}`;
    if (state.getState(target.id, "protectedFromMurder")) {
      state.setState(target.id, "dead", true, true);
      state.addRelation(shooter.id, "killed", target.id, true);
      event += ` but ${target.name} was protected by the bulletproof vest.`;
    } else {
      state.setState(target.id, "dead", true);
      state.addRelation(shooter.id, "killed", target.id);
      event += ` and killed him/her.`;
    }
    state.setGlobalState("event", event);
  },
};
