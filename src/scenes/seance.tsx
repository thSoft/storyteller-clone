import { Scene } from "../types";

const person1Slot = { id: "person1", label: "Person 1" };
const person2Slot = { id: "person2", label: "Person 2" };
export const seance: Scene = {
  id: "seance",
  name: "👻 Seance",
  slots: [person1Slot, person2Slot],
  outcomeLogic: (state, assigned) => {
    const person1 = assigned[person1Slot.id];
    const person2 = assigned[person2Slot.id];
    if (!person1 || !person2) {
      return;
    }
    const deadPerson = state.dead[person1.id]
      ? person1
      : state.dead[person2.id]
      ? person2
      : undefined;
    const livingPerson =
      deadPerson === person1
        ? person2
        : deadPerson === person2
        ? person1
        : undefined;
    if (deadPerson && livingPerson) {
      let eventPostfix = "";
      if (state.hasMoney[livingPerson.id] && !state.hasMoney[deadPerson.id]) {
        state.willingToGiveMoney[livingPerson.id] = true;
        eventPostfix = `${livingPerson.name} is moved by the ghost of ${deadPerson.name} and is now willing to give money to the poor.`;
      }
      state.event = `${livingPerson.name} saw the ghost of ${deadPerson.name}.${eventPostfix}`;
    }
  },
};
