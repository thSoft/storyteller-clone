import { characters } from "../characters";
import { Scene } from "../types";
import { getState, handlePreconditions, setState } from "./sceneUtils";

export const confronterSlot = { id: "confronter", label: "Confronter" };
export const confrontedSlot = { id: "confronted", label: "Confronted" };
export const confrontation: Scene = {
  id: "confrontation",
  name: "🫵 Confrontation",
  slots: [confronterSlot, confrontedSlot],
  outcomeLogic: (state, assigned) => {
    const confronter = assigned[confronterSlot.id];
    const confronted = assigned[confrontedSlot.id];
    if (!confronter || !confronted) return;
    if (handlePreconditions(state, confronter, confronted)) return;
    const thought = getState(state, confronter.id, "awareOf");
    if (thought === undefined) {
      state.event = `${confronter.name} had nothing to confront ${confronted.name} with.`;
      return;
    }
    switch (thought.type) {
      case "deal":
        if (thought.executorId === confronted.id) {
          if (state.graph.getAttribute("personWithGun") === confronted.id) {
            state.graph.setAttribute("personWithGun", confronter.id);
            setState(state, confronted.id, "awareOf", {
              type: "confiscated",
              confiscatorId: confronter.id,
              confiscatedId: confronted.id,
            });
            state.event = `${confronter.name} confiscated the violin case from ${confronted.name}.`;
          } else {
            state.event = `${confronter.name} confronted ${confronted.name} with the deal, but could do nothing about it.`;
          }
        }
        break;
      case "killed":
        if (thought.killerId === confronter.id) {
          state.event = `${confronter.name} arrested ${confronted.name} for the murder of ${
            characters[thought.victimId]?.name
          }.`;
        }
        break;
      case "robbed":
        if (thought.thiefId === confronter.id) {
          state.event = `${confronter.name} arrested ${confronted.name} for the robbery of the bank.`;
        }
        break;
      case "loves":
        state.event = `${confronter.name} confronted ${confronted.name} with the fact that ${
          characters[thought.lover1Id]?.name
        } loves ${characters[thought.lover2Id]?.name}.`;
        break;
    }
  },
};
