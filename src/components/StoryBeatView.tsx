import { useDispatch } from "react-redux";
import {
  removeStoryBeatFromCurrentPuzzle,
  setSlotCharacter,
} from "../gameStateSlice";
import { sceneTemplates } from "../sceneTemplates";
import { SceneSlot, StoryBeat, StoryState } from "../types";
import { DroppableSlot } from "./DroppableSlot";
import { InsertionPoint } from "./InsertionPoint";

export const StoryBeatView: React.FC<{
  beat: StoryBeat;
  index: number;
  states: StoryState[];
}> = ({ beat, index, states }) => {
  const template = sceneTemplates[beat.templateId];
  const dispatch = useDispatch();
  const handleRemoveBeat = () => {
    dispatch(removeStoryBeatFromCurrentPuzzle({ index: index }));
  };
  const handleAssignCharacter = (slotId: string, characterId: string) => {
    dispatch(
      setSlotCharacter({
        storyBeatIndex: index,
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
          marginBottom: "8px",
          border: "1px solid black",
          padding: "8px",
        }}
      >
        <h3>{template?.name}</h3>
        {template?.slots.map((slot: SceneSlot) => (
          <DroppableSlot
            key={slot.id}
            slot={slot}
            assignedCharacter={beat.slotAssignedCharacters[slot.id]}
            onAssignCharacter={(characterId) =>
              handleAssignCharacter(slot.id, characterId)
            }
          />
        ))}
        <p>{states[index + 1]?.event || "\u00A0"}</p>
        <button onClick={() => handleRemoveBeat()}>Remove</button>
      </div>
      <InsertionPoint index={index + 1} />
    </span>
  );
};
