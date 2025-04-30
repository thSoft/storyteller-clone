import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { addPanelToCurrentPuzzle } from "../store/gameStateSlice";
import { Puzzle } from "../types";
import { ItemTypes } from "./ItemTypes";

export const InsertionPoint: React.FC<{
  puzzle: Puzzle;
  index: number;
  panelCount: number;
}> = ({ puzzle, index, panelCount }) => {
  const dispatch = useDispatch();

  const handleInsertPanel = (index: number, sceneId: string) => {
    if (panelCount < puzzle.maxPanelCount) {
      dispatch(
        addPanelToCurrentPuzzle({
          panel: {
            sceneId,
            slotAssignedCharacters: {},
          },
          index: index,
        })
      );
    }
  };

  const [{ dragging }, drop] = useDrop(() => ({
    accept: ItemTypes.SCENE,
    canDrop: () => panelCount < puzzle.maxPanelCount, // Disallow dropping if maxPanelCount is reached
    drop: (item: { sceneId: string }) => handleInsertPanel(index, item.sceneId),
    collect: (monitor) => ({
      dragging: !!monitor.canDrop(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null);
  drop(ref);

  return (
    <div
      ref={ref}
      style={{
        height: "16px",
        backgroundColor: panelCount < puzzle.maxPanelCount && dragging ? "lightgreen" : "transparent",
        margin: "4px 0",
      }}
    >
      {panelCount === 0 && "Please drag and drop scenes here."}
    </div>
  );
};
