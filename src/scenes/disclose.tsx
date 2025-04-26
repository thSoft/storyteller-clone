import { characters } from "../characters";
import { Scene } from "../types";
import { areRelated, getEavesdropperId, getState, handlePreconditions, setState, setStates } from "./sceneUtils";
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
    if (thought === undefined) {
      state.event = `${speaker.name} had nothing to tell to ${listener.name}.`;
      return;
    }
    setStates(state, [listener.id, getEavesdropperId(state)], "awareOf", thought);
    switch (thought.type) {
      case "killed":
        const victim = characters[thought.victimId];
        if (victim === undefined) return;
        state.event = `${speaker.name} told ${listener.name} that ${victim.name} was killed.`;
        if (areRelated(state, listener.id, "wantsToKill", victim.id) === true) {
          state.event += ` ${listener.name} was glad to hear it.`;
          setState(state, listener.id, "content", true);
          if (areRelated(state, speaker.id, "isBoundByDealWith", listener.id) === true) {
            setState(state, speaker.id, "rewarded", true);
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
            setState(state, speaker.id, "rewarded", true);
            state.event += ` ${listener.name} was glad to hear it. ${listener.name} shared the money with ${speaker.name}.`;
          } else {
            state.event = `${speaker.name} told ${listener.name} that someone else robbed the bank.`;
            if (areRelated(state, speaker.id, "isBoundByDealWith", listener.id) === true) {
              setState(state, listener.id, "fired", true);
              state.event += ` ${listener.name} was angry to hear it. ${listener.name} fired ${speaker.name}.`;
            }
          }
        }
        break;
      case "deal":
        state.event = `${speaker.name} told ${listener.name} that ${
          characters[thought.ordererId]?.name
        } had a deal with ${characters[thought.executorId]?.name}.`;
        break;
      case "loves":
        state.event = `${speaker.name} told ${listener.name} that ${characters[thought.lover1Id]?.name} loves ${
          characters[thought.lover2Id]?.name
        }.`;
        break;
      case "confiscated":
        state.event = `${speaker.name} told ${listener.name} that ${
          characters[thought.confiscatorId]?.name
        } confiscated the violin case from ${characters[thought.confiscatedId]?.name}.`;
        if (
          thought.confiscatedId === speaker.id &&
          areRelated(state, speaker.id, "isBoundByDealWith", listener.id) === true
        ) {
          setState(state, speaker.id, "fired", true);
          state.event += ` ${speaker.name} was angry to hear it. ${speaker.name} fired ${listener.name}.`;
        }
        break;
    }
  },
};
