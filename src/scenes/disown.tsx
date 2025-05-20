import { characters } from "../characters";
import { Scene } from "../types";

const confronterSlot = { id: "confronter", label: "Confronter" };
const confrontedSlot = { id: "confronted", label: "Confronted" };

export const disown: Scene = {
  id: "disown",
  name: "Disown",
  color: "#5C656A",
  slots: [confronterSlot, confrontedSlot],
  outcomeLogic: (state, assigned) => {
    const confronter = assigned[confronterSlot.id];
    const confronted = assigned[confrontedSlot.id];
    if (!state.areRelated(confronted.id, "childOf", confronter.id)) {
      state.think(confronter.id, `${confronted.name} is not my child.`);
      return;
    }
    // If confronter is aware of his child loving someone who the confronter wants to kill,
    // then disown him/her
    const loverOfConfrontedIds = Array.from(
      new Set([
        ...state.getRelated(confronted.id, "loves", confronter.id),
        ...state.getRelatedBy(confronted.id, "loves", confronter.id),
      ])
    );
    const mortalEnemiesOfConfronterLoverOfConfrontedIds = loverOfConfrontedIds.filter((loverId) =>
      state.areRelated(confronter.id, "wantsToKill", loverId)
    );
    if (mortalEnemiesOfConfronterLoverOfConfrontedIds.length > 0) {
      state.say(
        confronter.id,
        `You shall not be a part of my family because you love ${mortalEnemiesOfConfronterLoverOfConfrontedIds
          .map((loverId) => characters[loverId]?.name)
          .join(", ")}! Don't you know what did he do?`
      );
      handleDisown();
      return;
    }
    // If confronter is aware of his child working for the police,
    // then disown him/her
    if (state.getState(confronted.id, "worksForPolice", confronter.id)) {
      state.say(confronter.id, `You shall not be a part of my family because you work for the police!`);
      handleDisown();
      return;
    }

    function handleDisown() {
      state.setState(confronted.id, "disowned", true);
      // TODO state.act(confronter.id, "disown");
      // TODO state.act(confronted.id, "disowned");
    }
  },
};
