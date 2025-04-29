import { characters } from "../characters";
import { Scene } from "../types";
import { getCharacter, getRelated, getState, handlePreconditions, setState } from "./sceneUtils";

export const confronterSlot = { id: "confronter", label: "Confronter" };
export const confrontedSlot = { id: "confronted", label: "Confronted" };
export const confrontation: Scene = {
  id: "confrontation",
  name: "🫵 Confrontation",
  slots: [confronterSlot, confrontedSlot],
  outcomeLogic: (state, assigned) => {
    const confronter = assigned[confronterSlot.id];
    const confronted = assigned[confrontedSlot.id];
    if (handlePreconditions(state, confronter, confronted)) return;
    const thoughtOfConfronter = getState(state, confronter.id, "awareOf");
    if (thoughtOfConfronter === undefined) {
      state.event = `${confronter.name} had nothing to confront ${confronted.name} with.`;
      return;
    }
    switch (thoughtOfConfronter.type) {
      case "deal":
        if (thoughtOfConfronter.executorId === confronted.id) {
          if (
            state.graph.getAttribute("personWithGun") === confronted.id &&
            getState(state, confronter.id, "worksForPolice")
          ) {
            state.graph.setAttribute("personWithGun", confronter.id);
            setState(state, confronted.id, "awareOf", {
              type: "confiscated",
              confiscatorId: confronter.id,
              confiscatedId: confronted.id,
            });
            state.event = `${confronter.name} confiscated the violin case from ${confronted.name}.`;
            return;
          } else {
            state.event = `${confronter.name} confronted ${confronted.name} with the deal, but could do nothing about it.`;
            return;
          }
        }
        break;
      case "killed":
        if (thoughtOfConfronter.killerId === confronter.id && getState(state, confronter.id, "worksForPolice")) {
          setState(state, confronted.id, "arrested", true);
          state.event = `${confronter.name} arrested ${confronted.name} for the murder of ${
            characters[thoughtOfConfronter.victimId]?.name
          }.`;
          return;
        }
        break;
      case "robbed":
        if (thoughtOfConfronter.thiefId === confronter.id && getState(state, confronter.id, "worksForPolice")) {
          setState(state, confronted.id, "arrested", true);
          state.event = `${confronter.name} arrested ${confronted.name} for the robbery of the bank.`;
          return;
        }
        break;
      case "loves":
        const [lover1, lover2] = getCharacter(
          (character, otherCharacter) =>
            character.id === confronted.id &&
            getRelated(state, character.id, "childOf").includes(confronter.id) &&
            otherCharacter !== undefined &&
            getRelated(state, confronter.id, "wantsToKill").includes(otherCharacter.id),
          characters[thoughtOfConfronter.lover1Id],
          characters[thoughtOfConfronter.lover2Id]
        );
        if (lover1 !== undefined && lover2 !== undefined) {
          setState(state, confronted.id, "disowned", true);
          state.event = `${confronter.name} disowned ${confronted.name} because of his/her love for ${
            characters[lover2.id]?.name
          }.`;
          return;
        } else {
          state.event = `${confronter.name} confronted ${confronted.name} with the fact that ${
            characters[thoughtOfConfronter.lover1Id]?.name
          } loves ${characters[thoughtOfConfronter.lover2Id]?.name}.`;
          return;
        }
    }
    const thoughtOfConfronted = getState(state, confronted.id, "awareOf");
    if (thoughtOfConfronted === undefined) {
      return;
    }
    switch (thoughtOfConfronted.type) {
      case "deal":
        if (
          thoughtOfConfronted.executorId !== confronter.seemingly.id &&
          state.graph.getAttribute("personWithGun") === confronter.id
        ) {
          setState(state, confronted.id, "shockedByGun", true);
          state.event = `${confronter.name} shocked ${confronted.name} by showing that (s)he has the violin case.`;
        }
        return;
    }
  },
};
