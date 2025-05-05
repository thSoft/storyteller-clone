import { Scene } from "../types";

const eavesdropperSlot = { id: "eavesdropper", label: "Eavesdropper" };

export const eavesdrop: Scene = {
  id: "eavesdrop",
  name: "Eavesdrop",
  slots: [eavesdropperSlot],
  outcomeLogic: (state, assigned) => {
    const eavesdropper = assigned[eavesdropperSlot.id];
    state.setGlobalState("eavesdropper", eavesdropper);
    state.setDescription(`${eavesdropper.name} eavesdropped on the following event.`);
  },
};
