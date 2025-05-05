import { characters } from "../characters";
import { Scene } from "../types";

const overtakerSlot = { id: "overtaker", label: "Overtaker" };

export const takeOver: Scene = {
  id: "takeOver",
  name: "Take Over",
  slots: [overtakerSlot],
  outcomeLogic: (state, assigned) => {
    const overtaker = assigned[overtakerSlot.id];

    if (state.getState(overtaker.id, "headOfFamily")) {
      state.setDescription(`${overtaker.name} is already the head of the family.`);
      return;
    }
    if (state.getState(overtaker.id, "disowned")) {
      state.setDescription(`${overtaker.name} is disowned and cannot become the head of the family.`);
      return;
    }
    if (state.getState(overtaker.id, "worksForPolice")) {
      state.setDescription(`${overtaker.name} is a police officer and does not want to become the head of the family.`);
      return;
    }
    const obeys = [...state.getRelated(overtaker.id, "obeys"), ...state.getRelated(overtaker.id, "childOf")];
    if (obeys.length === 0) {
      state.setDescription(`${overtaker.name} has no one to obey.`);
      return;
    }
    const headOfFamilyId = obeys[0];
    const headOfFamily = characters[headOfFamilyId];
    if (headOfFamily === undefined) {
      return;
    }
    if (!state.getState(headOfFamilyId, "headOfFamily")) {
      state.setDescription(`${headOfFamily.name} is not the head of the family.`);
      return;
    }
    if (!state.getState(headOfFamilyId, "dead")) {
      state.setDescription(
        `${headOfFamily.name} is still alive and wouldn't let ${overtaker.name} become the head of the family.`
      );
      return;
    }
    const successorIds = state.getState(headOfFamilyId, "successors")?.map((successor) => successor.id);
    if (successorIds === undefined || successorIds.length === 0) {
      state.setDescription(`${overtaker.name} has no one to succeed.`);
      return;
    }
    const actualSuccessorIds = successorIds.filter(
      (successorId) =>
        !state.getState(successorId, "arrested") &&
        !state.getState(successorId, "dead") &&
        !state.getState(successorId, "worksForPolice") &&
        !state.getState(successorId, "disowned")
    );
    if (actualSuccessorIds.length > 0 && actualSuccessorIds[0] !== overtaker.id) {
      state.setDescription(
        `${overtaker.name} can't succeed ${headOfFamily.name} because ${
          characters[actualSuccessorIds[0]]?.name
        } precedes him/her in the succession.`
      );
      return;
    }
    state.setState(overtaker.id, "headOfFamily", true);
    state.setDescription(`${overtaker.name} became the head of the family.`);
  },
};
