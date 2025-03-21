import { useDispatch } from "react-redux";
import {
  removePanelFromCurrentPuzzle,
  setSlotCharacter,
} from "../gameStateSlice";
import { scenes } from "../scenes";
import { Panel, SceneSlot, StoryState } from "../types";
import { DroppableSlot } from "./DroppableSlot";
import { InsertionPoint } from "./InsertionPoint";

export const PanelView: React.FC<{
  panel: Panel;
  index: number;
  states: StoryState[];
}> = ({ panel: panel, index, states }) => {
  const scene = scenes[panel.sceneId];
  const dispatch = useDispatch();
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
  return (
    <span>
      <div
        key={index}
        style={{
          border: "1px solid black",
          padding: "8px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{scene?.name}</h3>
        {scene?.slots.map((slot: SceneSlot) => (
          <DroppableSlot
            key={slot.id}
            slot={slot}
            assignedCharacter={panel.slotAssignedCharacters[slot.id]}
            onAssignCharacter={(characterId) =>
              handleAssignCharacter(slot.id, characterId)
            }
          />
        ))}
        <p>{states[index + 1]?.event || "\u00A0"}</p>
        <button onClick={() => handleRemovePanel()}>Remove</button>
      </div>
      <InsertionPoint index={index + 1} />
    </span>
  );
};
