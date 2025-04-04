import { grandma, hunter, red, wolf } from "../characters";
import { Scene } from "../types";
import { handleDead, handleMeeting, ifCharactersAre } from "./sceneUtils";

const person1Slot = { id: "person1", label: "Person 1" };
const person2Slot = { id: "person2", label: "Person 2" };
export const forest: Scene = {
  id: "forest",
  name: "🌳 Forest",
  slots: [person1Slot, person2Slot],
  outcomeLogic: (state, assigned) => {
    const person1 = assigned[person1Slot.id];
    const person2 = assigned[person2Slot.id];
    if (handleDead(state, person1, person2)) return;
    if (person1 === undefined || person2 === undefined) {
      return;
    }
    if (person1.id === grandma.id || person2.id === grandma.id) {
      state.event = `${grandma.name} is very old, so she can't exit her house.`;
      return;
    }
    ifCharactersAre(person1, person2, red.id, wolf.id, () => {
      if (state.knowsAboutWolf[red.id]) {
        state.dead[red.id] = true;
        state.event = `${wolf.name} asked ${red.name} where is ${grandma.name}'s house, but she refused to answer, so ${wolf.name} ate her.`;
      } else {
        state.knowsAboutWolf[red.id] = true;
        state.knowsLocationOfGrandma[wolf.id] = true;
        state.event = `${wolf.name} asked ${red.name} where is ${grandma.name}'s house, and she told him.`;
      }
    });
    ifCharactersAre(person1, person2, red.id, hunter.id, () => {
      if (state.knowsAboutWolf[hunter.id]) {
        state.knowsAboutWolf[red.id] = true;
        state.event = `${hunter.name} warned ${red.name} that ${wolf.name} is dangerous and she should not tell him where ${grandma.name} lives.`;
      } else {
        if (state.knowsAboutWolf[red.id]) {
          state.knowsAboutWolf[hunter.id] = true;
          state.event = `${red.name} told ${hunter.name} that she met the ${wolf.name} and told him where ${grandma.name} lives.`;
        } else {
          handleMeeting(state, person1, person2);
        }
      }
    });
    ifCharactersAre(person1, person2, wolf.id, hunter.id, () => {
      state.knowsAboutWolf[hunter.id] = true;
      state.event = `${hunter.name} nearly shot ${wolf.name}, but he was quicker and he escaped. ${hunter.name} is now aware of ${wolf.name}'s presence.`;
    });
  },
};
