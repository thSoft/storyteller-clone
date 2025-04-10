import { Scene } from "../types";
import { handlePreconditions } from "./sceneUtils";

export const moonWatcherSlot = { id: "moonWatcher", label: "Moon watcher" };
export const moon: Scene = {
  id: "moon",
  name: "🌙 Moon",
  slots: [moonWatcherSlot],
  outcomeLogic: (state, assigned) => {
    const moonWatcher = assigned[moonWatcherSlot.id];
    if (handlePreconditions(state, moonWatcher)) return;
    if (!moonWatcher) return;
    if (state.fullMoon) {
      state.fullMoon = false;
      if (
        state.canBecomeWerewolf[moonWatcher.id] &&
        state.wolfLike[moonWatcher.id]
      ) {
        state.wolfLike[moonWatcher.id] = false;
        state.event = `${moonWatcher.name} transformed back into a human.`;
      }
    } else {
      state.fullMoon = true;
      if (state.canBecomeWerewolf[moonWatcher.id]) {
        if (state.wolfLike[moonWatcher.id]) {
          state.event = `${moonWatcher.name} howled at the full moon.`;
        } else {
          state.wolfLike[moonWatcher.id] = true;
          state.event = `${moonWatcher.name} transformed into a werewolf under the full moon.`;
        }
      }
    }
  },
};
