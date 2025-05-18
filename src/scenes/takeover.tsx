import { characters } from "../characters";
import { Scene } from "../types";

const overtakerSlot = { id: "overtaker", label: "Overtaker" };

export const takeOver: Scene = {
  id: "takeOver",
  name: "Take Over",
  color: "#006072",
  slots: [overtakerSlot],
  outcomeLogic: (state, assigned) => {
    const overtaker = assigned[overtakerSlot.id];

    if (state.getState(overtaker.id, "headOfFamily")) {
      state.think(overtaker.id, `I am already the head of the family.`);
      return;
    }
    if (state.getState(overtaker.id, "disowned")) {
      state.think(overtaker.id, `I am disowned and cannot become the head of the family.`);
      return;
    }
    if (state.getState(overtaker.id, "worksForPolice")) {
      state.think(overtaker.id, `I am a police officer and do not want to become the head of the family.`);
      return;
    }
    const obeys = [...state.getRelated(overtaker.id, "obeys"), ...state.getRelated(overtaker.id, "childOf")];
    if (obeys.length === 0) {
      state.think(overtaker.id, `I have no one to obey.`);
      return;
    }
    const headOfFamilyId = obeys[0];
    const headOfFamily = characters[headOfFamilyId];
    if (headOfFamily === undefined) {
      return;
    }
    if (!state.getState(headOfFamilyId, "headOfFamily")) {
      state.think(overtaker.id, `${headOfFamily.name} is not the head of the family.`);
      return;
    }
    if (!state.getState(headOfFamilyId, "dead")) {
      state.think(
        overtaker.id,
        `${headOfFamily.name} is still alive and wouldn't let ${overtaker.name} become the head of the family.`
      );
      return;
    }
    const successorIds = state.getState(headOfFamilyId, "successors")?.map((successor) => successor.id);
    if (successorIds === undefined || successorIds.length === 0) {
      state.think(overtaker.id, `${headOfFamily.name} has no one to succeed.`);
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
      state.think(
        overtaker.id,
        `I can't succeed ${headOfFamily.name} because ${
          characters[actualSuccessorIds[0]]?.name
        } precedes me in the succession.`
      );
      return;
    }
    state.setState(overtaker.id, "headOfFamily", true);
    state.say(overtaker.id, `Now I am the head of the family!`);
    // TODO state.act(overtaker.id, "takeOver");
  },
};
