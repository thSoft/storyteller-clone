import { Scene } from "../types";
import { getPerson } from "./sceneUtils";

const person1Slot = { id: "person1", label: "Person 1" };
const person2Slot = { id: "person2", label: "Person 2" };
export const seance: Scene = {
  id: "seance",
  name: "👻 Seance",
  slots: [person1Slot, person2Slot],
  outcomeLogic: (state, assigned) => {
    const person1 = assigned[person1Slot.id];
    const person2 = assigned[person2Slot.id];
    if (!person1 || !person2) return;
    const [deadPerson, livingPerson] = getPerson(
      (person) => state.dead[person.id],
      person1,
      person2
    );
    if (deadPerson && livingPerson) {
      state.event = `${livingPerson.name} saw the ghost of ${deadPerson.name}.`;
      if (state.hasMoney[livingPerson.id] && !state.hasMoney[deadPerson.id]) {
        state.willingToGiveMoney[livingPerson.id] = true;
        state.event += ` ${livingPerson.name} was moved by the ghost of ${deadPerson.name} and became willing to give money to the poor.`;
      }
    }
  },
};
