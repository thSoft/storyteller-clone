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
  return (
    <span>
      <div
        key={index}
        style={{
          border: "1px solid black",
          padding: "8px",
        }}
        onContextMenu={handleContextMenu}
      >
        <h4 style={{ marginTop: 0 }}>
          {scene?.name}{" "}
          <button style={{ float: "right" }} onClick={() => handleRemovePanel()}>
            Remove
          </button>
        </h4>
        {scene?.slots.map((slot: SceneSlot) => (
          <SlotView
            key={slot.id}
            slot={slot}
            assignedCharacter={panel.slotAssignedCharacters[slot.id]}
            onAssignCharacter={(characterId) => handleAssignCharacter(slot.id, characterId)}
          />
        ))}
        <div>{toFirstUpper(state?.event) || "\u00A0"}</div>
        {showGraph && state && <StoryGraphView graph={state.graph} width={800} height={400} />}
      </div>
      <InsertionPoint puzzle={puzzle} index={index + 1} panelCount={panelCount} />
    </span>
  );
};
