import { characters } from "../characters";
import { Scene } from "../types";
import { handleMurderDiscovery } from "./sceneUtils";

const shooterSlot = { id: "shooter", label: "Shooter" };
const targetSlot = { id: "target", label: "Target" };

export const shoot: Scene = {
  id: "shoot",
  name: "Shoot",
  slots: [shooterSlot, targetSlot],
  outcomeLogic: (state, assigned) => {
    const shooter = assigned[shooterSlot.id];
    const target = assigned[targetSlot.id];
    if (!state.areRelated(shooter.id, "wantsToKill", target.id)) {
      state.addAction({
        type: "thought",
        characterId: shooter.id,
        message: `I don't want to kill ${target.name}.`,
      });
      return;
    }
    if (state.getState(shooter.id, "doesNotKill")) {
      state.setDescription(`${shooter.name} doesn't want to get his hands dirty.`);
      return;
    }
    if (state.getGlobalState("gunOwner")?.id !== shooter.id) {
      state.setDescription(`${shooter.name} didn't have a gun.`);
      return;
    }
    state.addAction({
      type: "other",
      characterId: shooter.id,
      action: "shoot",
    });
    state.addAction({
      type: "other",
      characterId: target.id,
      action: "shot",
    });
    if (state.getState(target.id, "protectedFromMurder")) {
      state.setState(target.id, "dead", true, true);
      state.addRelation(shooter.id, "killed", target.id, true);
    } else {
      state.setState(target.id, "dead", true);
      state.addRelation(shooter.id, "killed", target.id);
    }

    // Handle murder discovery for eavesdropper if present
    const eavesdropperId = state.getGlobalState("eavesdropper")?.id;
    if (eavesdropperId) {
      const eavesdropper = characters[eavesdropperId];
      if (eavesdropper) {
        handleMurderDiscovery(state, eavesdropper, shooter, target);
      }
    }
  },
};
