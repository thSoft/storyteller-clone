import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { scenes } from "../scenes";
import { placeholder } from "../scenes/placeholder";
import { createStateProxy } from "../stateProxy";
import {
  addPanelToCurrentPuzzle,
  removePanelFromCurrentPuzzle,
  setPanelScene,
  setSlotCharacter,
} from "../store/gameStateSlice";
import { StoryState } from "../storyState";
import { Panel, Puzzle, SceneSlot } from "../types";
import { toFirstUpper } from "../utils";
import { ItemTypes } from "./ItemTypes";
import { SlotView } from "./SlotView";
import { StoryGraphView } from "./StoryGraphView";

export const PanelView: React.FC<{
  puzzle: Puzzle;
  panel: Panel;
  index: number;
  states: StoryState[];
  panelCount: number;
}> = ({ panel, index, states, panelCount }) => {
  const scene = scenes[panel.sceneId];
  const dispatch = useDispatch();
  const [showGraph, setShowGraph] = useState(false);

  const handleAddPanelBefore = () => {
    dispatch(addPanelToCurrentPuzzle({ index: index, panel: { sceneId: placeholder.id, slotAssignedCharacters: {} } }));
  };

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

  const dropRef = useRef<HTMLDivElement>(null);

  const [{ dragging, isOver, itemType }, drop] = useDrop({
    accept: [ItemTypes.CHARACTER, ItemTypes.SCENE],
    drop: (item: { characterId: string } | { sceneId: string }) => {
      if ("sceneId" in item) {
        dispatch(setPanelScene({ index, sceneId: item.sceneId }));
      } else if ("characterId" in item) {
        const slots = Object.keys(panel.slotAssignedCharacters);
        if (!slots.length || !panel.slotAssignedCharacters[slots[0]]) {
          // Assign to the first slot if it's unassigned
          handleAssignCharacter(scene.slots[0].id, item.characterId);
        }
      }
    },
    collect: (monitor) => ({
      itemType: monitor.getItemType(),
      dragging: monitor.canDrop(),
      isOver: !!monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (dropRef.current) {
      drop(dropRef);
    }
  }, [panel, drop]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowGraph(true);
  };

  const state = states[index + 1];
  const event = state?.getAttribute("event");
  const actions = event?.actions;

  const slotsAreEmpty = Object.keys(panel.slotAssignedCharacters).length === 0;
  const showDragging = dragging && (itemType === ItemTypes.CHARACTER ? slotsAreEmpty : true);
  return (
    <div title={toFirstUpper(event?.description)} style={{ display: "flex", flexDirection: "row", gap: "0" }}>
      <div
        ref={dropRef}
        key={`${index}-${panelCount}`}
        style={{
          border: "1px solid black",
          backgroundColor: showDragging && isOver ? "yellow" : showDragging ? "lightgreen" : "white",
          paddingLeft: "0.5vw",
          paddingRight: "0.5vw",
          paddingTop: "0.8vh",
          paddingBottom: "0.8vh",
          display: "flex",
          flexDirection: "column",
          gap: "0.1vh",
          width: "14vw",
        }}
        onContextMenu={handleContextMenu}
      >
        <h4 style={{ marginTop: 0, textAlign: "center" }}>
          <button style={{ float: "left" }} onClick={() => handleAddPanelBefore()} title="Add panel before">
            ➕
          </button>
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
            gap: "1.5vw",
            height: "30vh",
          }}
        >
          {!slotsAreEmpty &&
            scene?.slots.map((slot: SceneSlot, slotIndex: number) => {
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
                  state={createStateProxy(state)}
                />
              );
            })}
        </div>
        {showGraph && state && <StoryGraphView graph={state} width={600} height={400} />}
      </div>
    </div>
  );
};
