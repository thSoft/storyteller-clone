import { useState } from "react";
import { useDispatch } from "react-redux";
import { scenes } from "../scenes";
import { removePanelFromCurrentPuzzle, setSlotCharacter } from "../store/gameStateSlice";
import { StoryState } from "../storyState";
import { Panel, Puzzle, SceneSlot } from "../types";
import { toFirstUpper } from "../utils";
import { InsertionPoint } from "./InsertionPoint";
import { SlotView } from "./SlotView";
import { StoryGraphView } from "./StoryGraphView";

export const PanelView: React.FC<{
  puzzle: Puzzle;
  panel: Panel;
  index: number;
  states: StoryState[];
  panelCount: number;
}> = ({ puzzle, panel, index, states, panelCount }) => {
  const scene = scenes[panel.sceneId];
  const dispatch = useDispatch();
  const [showGraph, setShowGraph] = useState(false);

  const handleRemovePanel = () => {
    dispatch(removePanelFromCurrentPuzzle({ index: index }));
  };

  const handleAssignCharacter = (slotId: string, characterId: string) => {
    dispatch(
      setSlotCharacter({
        panelIndex: index,
        slotId: slotId,
        characterId: characterId,
      })
    );
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowGraph(true);
  };

  const state = states[index + 1];
  const event = state?.getAttribute("event");
  const actions = event?.actions;
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "0" }}>
      <InsertionPoint puzzle={puzzle} index={index} panelCount={panelCount} />
      <div
        key={`${index}-${panelCount}`}
        style={{
          border: "1px solid black",
          padding: "8px",
          width: "300px",
        }}
        onContextMenu={handleContextMenu}
      >
        <h4 style={{ marginTop: 0 }}>
          {scene?.name}{" "}
          <button style={{ float: "right" }} onClick={() => handleRemovePanel()} title="Remove panel">
            ❌
          </button>
        </h4>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "4px",
          }}
        >
          {scene?.slots.map((slot: SceneSlot, slotIndex: number) => {
            const characterActions = actions?.filter(
              (bubble) => bubble.characterId === panel.slotAssignedCharacters[slot.id]
            );
            return (
              <SlotView
                key={slot.id}
                slot={slot}
                index={slotIndex}
                panelIndex={index}
                assignedCharacter={panel.slotAssignedCharacters[slot.id]}
                onAssignCharacter={(characterId) => handleAssignCharacter(slot.id, characterId)}
                speech={characterActions?.find((action) => action.type === "speech")}
                thought={characterActions?.find((action) => action.type === "thought")}
                otherAction={characterActions?.find((action) => action.type === "other")}
              />
            );
          })}
        </div>
        <div>{toFirstUpper(event?.description)}</div>
        {showGraph && state && <StoryGraphView graph={state} width={800} height={400} />}
      </div>
    </div>
  );
};
