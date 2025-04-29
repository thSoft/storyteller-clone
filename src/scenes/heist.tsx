import { Thought } from "../storyState";
import { Scene } from "../types";
import { getEavesdropperId, getState, handlePreconditions, setStates } from "./sceneUtils";

export const thiefSlot = { id: "thief", label: "Thief" };
export const heist: Scene = {
  id: "heist",
  name: "💰 Heist",
  slots: [thiefSlot],
  outcomeLogic: (state, assigned) => {
    const thief = assigned[thiefSlot.id];
    if (handlePreconditions(state, thief)) return;
    if (getState(state, thief.id, "doesNotSteal")) {
      state.event = `${thief.name} doesn't want to get his hands dirty.`;
      return;
    }
    if (!getState(state, thief.id, "knowsSecretCode")) {
      state.event = `${thief.name} didn't know the secret code of the safe.`;
      return;
    }
    state.graph.setAttribute("bankRobbed", true);
    const thought: Thought = {
      type: "robbed",
      thiefId: thief.id,
    };
    setStates(state, [thief.id, getEavesdropperId(state)], "awareOf", thought);
    state.event = `${thief.name} robbed the bank.`;
  },
};
