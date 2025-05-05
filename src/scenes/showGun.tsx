import { Scene } from "../types";

const confronterSlot = { id: "confronter", label: "Confronter" };
const confrontedSlot = { id: "confronted", label: "Confronted" };

export const showGun: Scene = {
  id: "showGun",
  name: "Show Gun",
  slots: [confronterSlot, confrontedSlot],
  outcomeLogic: (state, assigned) => {
    const confronter = assigned[confronterSlot.id];
    const confronted = assigned[confrontedSlot.id];
    if (state.getGlobalState("gunOwner")?.id !== confronter.id) {
      state.addAction({
        type: "thought",
        characterId: confronter.id,
        message: "I have no gun to show.",
      });
      return;
    }
    // If confronted is aware of the gun being possessed by someone other than the confronter,
    // and the confronter has the gun, then the confronted is shocked by the gun
    const gunOwnerBelievedByConfronted = state.getGlobalState("gunOwner", confronted.id);
    if (
      gunOwnerBelievedByConfronted !== undefined &&
      gunOwnerBelievedByConfronted?.id !== state.resolveImpersonation(confronter.id) &&
      state.getGlobalState("gunOwner")?.id === confronter.id
    ) {
      state.setState(confronted.id, "shockedByGun", true);
      state.setDescription(`${confronted.name} was shocked to see the violin case in the hands of ${confronter.name}.`);
      return true;
    }
  },
};
