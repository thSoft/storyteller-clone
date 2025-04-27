import { characters } from "../characters";
import { Scene } from "../types";
import { getRelated, getState, handlePreconditions, setState } from "./sceneUtils";
export const overtakerSlot = { id: "overtaker", label: "Overtaker" };
export const takeover: Scene = {
  id: "takeover",
  name: "👑 Takeover",
  slots: [overtakerSlot],
  outcomeLogic: (state, assigned) => {
    const overtaker = assigned[overtakerSlot.id];
    if (!overtaker) return;
    if (handlePreconditions(state, overtaker)) return;
    if (getState(state, overtaker.id, "headOfFamily")) {
      state.event = `${overtaker.name} is already the head of the family.`;
      return;
    }
    if (getState(state, overtaker.id, "disowned")) {
      state.event = `${overtaker.name} is disowned and cannot become the head of the family.`;
      return;
    }
    if (getState(state, overtaker.id, "worksForPolice")) {
      state.event = `${overtaker.name} is a police officer and does not want to become the head of the family.`;
      return;
    }
    const obeys = [...getRelated(state, overtaker.id, "obeys"), ...getRelated(state, overtaker.id, "childOf")];
    if (obeys.length === 0) {
      state.event = `${overtaker.name} has no one to obey.`;
      return;
    }
    const headOfFamilyId = obeys[0];
    const headOfFamily = characters[headOfFamilyId];
    if (headOfFamily === undefined) {
      return;
    }
    if (!getState(state, headOfFamilyId, "headOfFamily")) {
      state.event = `${headOfFamily.name} is not the head of the family.`;
      return;
    }
    if (!getState(state, headOfFamilyId, "dead")) {
      state.event = `${headOfFamily.name} is still alive and wouldn't let ${overtaker.name} become the head of the family.`;
      return;
    }
    const successorIds = getState(state, headOfFamilyId, "successors");
    if (successorIds === undefined || successorIds.length === 0) {
      state.event = `${overtaker.name} has no one to succeed.`;
      return;
    }
    const actualSuccessorIds = successorIds.filter(
      (successorId) =>
        !getState(state, successorId, "arrested") &&
        !getState(state, successorId, "dead") &&
        !getState(state, successorId, "worksForPolice") &&
        !getState(state, successorId, "disowned")
    );
    if (actualSuccessorIds.length > 0 && actualSuccessorIds[0] !== overtaker.id) {
      state.event = `${overtaker.name} can't succeed ${headOfFamily.name} because ${
        characters[actualSuccessorIds[0]]?.name
      } precedes him/her in the succession.`;
      return;
    }
    setState(state, overtaker.id, "headOfFamily", true);
    state.event = `${overtaker.name} became the head of the family.`;
  },
};
