import { dragon, princess } from "../characters";
import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

export const escape: Scene = {
  id: "escape",
  name: "🚪 Escape",
  slots: [],
  outcomeLogic: (state) => {
    if (handlePreconditions(state, princess)) return;
    switch (state.castleHealth) {
      case "intact":
        state.event = "The castle was intact. No one could escape.";
        break;
      case "cracked":
        if (state.distracted[dragon.id]) {
          state.princessIsFree = true;
          state.event = `The castle was cracked, and ${dragon.name} was distracted, so ${princess.name} escaped.`;
          break;
        } else {
          state.event = `${princess.name} tried to escape, but ${dragon.name} didn't let her out.`;
          break;
        }
      case "collapsed":
        state.event = "The castle had collapsed. No one could escape.";
        break;
    }
  },
};
