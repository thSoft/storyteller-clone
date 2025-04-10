import { grandma, hunter } from "../characters";
import { Scene } from "../types";
import {
  getPerson,
  handleLittleRedRidingHoodCharactersMeeting,
  handlePreconditions,
} from "./sceneUtils";

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
    handleLittleRedRidingHoodCharactersMeeting(
      state,
      inBed,
      notInBed,
      inBed.id === hunter.id,
      notInBed.id === hunter.id
    );
  },
};
