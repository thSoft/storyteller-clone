import { Scene } from "../types";

const confronterSlot = { id: "confronter", label: "Confronter" };
const confrontedSlot = { id: "confronted", label: "Confronted" };

export const showGun: Scene = {
  id: "showGun",
  name: "Show Gun",
  color: "#C68871",
  slots: [confronterSlot, confrontedSlot],
  outcomeLogic: (state, assigned) => {
    const confronter = assigned[confronterSlot.id];
    const confronted = assigned[confrontedSlot.id];
    if (state.getGlobalState("gunOwner")?.id !== confronter.id) {
      state.think(confronter.id, `I have no gun to show.`);
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
      state.say(confronter.id, `Look what I've got!`);
      state.act(confronter.id, "showGun");
      state.say(confronted.id, `Nooo! How did you get that?`);
      // TODO state.act(confronted.id, "shockedByGun");
      return;
    }
  },
};
