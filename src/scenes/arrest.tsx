import { Scene } from "../types";

const confronterSlot = { id: "confronter", label: "Confronter" };
const confrontedSlot = { id: "confronted", label: "Confronted" };

export const arrest: Scene = {
  id: "arrest",
  name: "Arrest",
  slots: [confronterSlot, confrontedSlot],
  outcomeLogic: (state, assigned) => {
    const confronter = assigned[confronterSlot.id];
    const confronted = assigned[confrontedSlot.id];
    // If confronter works for police and is aware of the confronted having killed someone,
    // then arrest the confronted
    if (
      state.getState(confronter.id, "worksForPolice") &&
      state.getRelated(confronted.id, "killed", confronter.id).length > 0
    ) {
      state.setState(confronted.id, "arrested", true);
      state.setDescription(`${confronter.name} arrested ${confronted.name} for murder.`);
      return;
    }
    // If confronter works for police and is aware of the confronted having robbed the bank,
    // then arrest the confronted
    if (
      state.getState(confronter.id, "worksForPolice") &&
      state.getGlobalState("bankRobber", confronter.id)?.id === confronted.id
    ) {
      state.setState(confronted.id, "arrested", true);
      state.setDescription(`${confronter.name} arrested ${confronted.name} for robbery.`);
      return;
    }
  },
};
