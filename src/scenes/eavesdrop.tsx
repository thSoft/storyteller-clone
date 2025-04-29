import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";
export const eavesdropperSlot = { id: "eavesdropper", label: "Eavesdropper" };
export const eavesdrop: Scene = {
  id: "eavesdrop",
  name: "👀 Eavesdrop",
  slots: [eavesdropperSlot],
  outcomeLogic: (state, assigned) => {
    const eavesdropper = assigned[eavesdropperSlot.id];
    if (handlePreconditions(state, eavesdropper)) return;
    state.graph.setAttribute("eavesdropperId", eavesdropper.id);
    state.event = `${eavesdropper.name} eavesdropped on the following event.`;
  },
};
