import { Scene } from "../types";
import { canShowPoliceBadge } from "./sceneUtils";

const confronterSlot = { id: "confronter", label: "Confronter" };
const confrontedSlot = { id: "confronted", label: "Confronted" };

export const arrest: Scene = {
  id: "arrest",
  name: "Arrest",
  color: "#7B4F97",
  slots: [confronterSlot, confrontedSlot],
  outcomeLogic: (state, assigned) => {
    const confronter = assigned[confronterSlot.id];
    const confronted = assigned[confrontedSlot.id];
    if (!canShowPoliceBadge(state, confronter, confronted)) {
      state.think(confronter.id, `${confronted.name} won't believe I'm a police officer.`);
      return;
    }
    // If confronter works for police and is aware of the confronted having killed someone,
    // then arrest the confronted
    if (state.getRelated(confronted.id, "killed", confronter.id).length > 0) {
      state.setState(confronted.id, "arrested", true);
      handleArrest("murder");
      return;
    }
    // If confronter works for police and is aware of the confronted having robbed the bank,
    // then arrest the confronted
    if (state.getGlobalState("bankRobber", confronter.id)?.id === confronted.id) {
      state.setState(confronted.id, "arrested", true);
      handleArrest("robbery");
      return;
    }
    state.think(confronter.id, `There is nothing to arrest ${confronted.name} for.`);

    function handleArrest(cause: string) {
      state.say(confronter.id, `In the name of the law, I arrest you for ${cause}!`);
      // TODO state.act(confronter.id, "arrest");
      // TODO state.act(confronted.id, "arrested");
    }
  },
};
