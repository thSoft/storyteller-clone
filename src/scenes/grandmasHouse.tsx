import { grandma, hunter, red, wolf } from "../characters";
import { Scene } from "../types";
import { getPerson, handleMeeting, handlePreconditions } from "./sceneUtils";

const inBedSlot = { id: "inBed", label: "Person in bed" };
const notInBedSlot = { id: "notInBed", label: "Person not in bed" };
export const grandmasHouse: Scene = {
  id: "grandmasHouse",
  name: "🏡 Grandma's house",
  slots: [inBedSlot, notInBedSlot],
  outcomeLogic: (state, assigned) => {
    const inBed = assigned[inBedSlot.id];
    const notInBed = assigned[notInBedSlot.id];
    if (handlePreconditions(state, inBed, notInBed)) return;
    if (inBed === undefined || notInBed === undefined) {
      return;
    }
    const [personNotKnowingLocationOfGrandma] = getPerson(
      (person) => !state.knowsLocationOfGrandma[person.id],
      inBed,
      notInBed
    );
    if (personNotKnowingLocationOfGrandma) {
      state.event = `${personNotKnowingLocationOfGrandma.name} doesn't know where ${grandma.name} lives, so they can't enter her house.`;
      return;
    }

    switch (inBed.id) {
      case grandma.id:
        switch (notInBed.id) {
          case wolf.id:
            state.dead[grandma.id] = true;
            state.event = `${wolf.name} ate ${grandma.name}.`;
            break;
          default:
            handleMeeting(state, inBed, notInBed);
            break;
        }
        break;
      case wolf.id:
        switch (notInBed.id) {
          case red.id:
            state.dead[red.id] = true;
            state.event = `${wolf.name} ate ${red.name} because she didn't realize who is hiding under the blanket.`;
            break;
          case hunter.id:
            state.dead[wolf.id] = true;
            state.event = `${hunter.name} heard ${wolf.name} snoring and shot him.`;
            break;
          case grandma.id:
            state.dead[grandma.id] = true;
            state.event = `${wolf.name} ate ${grandma.name} when she returned from the closet.`;
            break;
        }
        break;
      case hunter.id:
        switch (notInBed.id) {
          case wolf.id:
            if (state.knowsAboutWolf[hunter.id]) {
              state.dead[wolf.id] = true;
              state.event = `${hunter.name} already waited for ${wolf.name} and shot him because he didn't realize who is hiding under the blanket.`;
              break;
            } else {
              state.event = `${hunter.name} shot ${wolf.name} because he didn't realize who is hiding under the blanket.`;
              break;
            }
          default:
            handleMeeting(state, inBed, notInBed);
            break;
        }
        break;
      case red.id:
        switch (notInBed.id) {
          case wolf.id:
            state.dead[red.id] = true;
            state.event = `${wolf.name} ate ${red.name} while she was sleeping.`;
            break;
          default:
            handleMeeting(state, inBed, notInBed);
            break;
        }
        break;
    }
  },
};
