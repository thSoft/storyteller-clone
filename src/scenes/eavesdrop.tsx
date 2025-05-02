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

    // Set the eavesdropper for the next event
    state.setGlobalState("eavesdropper", eavesdropper);
    state.setGlobalState("event", `${eavesdropper.name} eavesdropped on the following event.`);
  },
};
