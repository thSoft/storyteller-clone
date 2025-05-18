import { Scene } from "../types";

const eavesdropperSlot = { id: "eavesdropper", label: "Eavesdropper" };

export const eavesdrop: Scene = {
  id: "eavesdrop",
  name: "Eavesdrop",
  color: "#7FA05E",
  slots: [eavesdropperSlot],
  outcomeLogic: (state, assigned) => {
    const eavesdropper = assigned[eavesdropperSlot.id];
    state.setGlobalState("eavesdropper", eavesdropper);
    state.setDescription(`${eavesdropper.name} eavesdropped on the following event.`);
    state.act(eavesdropper.id, "eavesdrop");
  },
};
