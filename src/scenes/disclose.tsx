import { characters } from "../characters";
import { Scene } from "../types";
import { areRelated, getState, handlePreconditions, setState } from "./sceneUtils";
export const speakerSlot = { id: "speaker", label: "Speaker" };
export const listenerSlot = { id: "listener", label: "Listener" };
export const disclose: Scene = {
  id: "disclose",
  name: "👂 Disclose",
  slots: [speakerSlot, listenerSlot],
  outcomeLogic: (state, assigned) => {
    const speaker = assigned[speakerSlot.id];
    const listener = assigned[listenerSlot.id];
    if (!speaker || !listener) return;
    if (handlePreconditions(state, speaker, listener)) return;
    const thought = getState(state, speaker.id, "awareOf");
    if (thought === undefined) return;
    switch (thought.type) {
      case "killed":
        const victim = characters[thought.victimId];
        if (victim === undefined) return;
        state.event = `${speaker.name} told ${listener.name} that ${victim.name} was killed.`;
        if (areRelated(state, listener.id, "wantsToKill", victim.id) === true) {
          state.event += ` ${listener.name} was glad to hear it.`;
          setState(state, listener.id, "content", true);
          if (areRelated(state, speaker.id, "isBoundByDealWith", listener.id) === true) {
            state.event += ` ${listener.name} promoted ${speaker.name}.`;
          }
        }
        break;
      case "robbed":
        if (thought.thiefId === speaker.id) {
          const thief = characters[thought.thiefId];
          if (thief === undefined) return;
          state.event = `${speaker.name} told ${listener.name} that he robbed the bank.`;
          if (areRelated(state, speaker.id, "isBoundByDealWith", listener.id) === true) {
              setState(state, listener.id, "content", true);
            state.event += ` ${listener.name} was glad to hear it. ${listener.name} promoted ${speaker.name}.`;
          } else {
            state.event = `${speaker.name} told ${listener.name} that someone else robbed the bank.`;
            if (areRelated(state, speaker.id, "isBoundByDealWith", listener.id) === true) {
              setState(state, listener.id, "fired", true);
              state.event += ` ${listener.name} was angry to hear it. ${listener.name} fired ${speaker.name}.`;
            }
          }
        }
        break;
    }
  },
};
