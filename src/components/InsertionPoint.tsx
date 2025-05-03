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

  const [{ dragging, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.SCENE,
    canDrop: () => panelCount < puzzle.maxPanelCount, // Disallow dropping if maxPanelCount is reached
    drop: (item: { sceneId: string }) => handleInsertPanel(index, item.sceneId),
    collect: (monitor) => ({
      dragging: !!monitor.canDrop(),
      isOver: !!monitor.isOver(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null);
  drop(ref);

  const backgroundColor =
    panelCount < puzzle.maxPanelCount ? (isOver ? "yellow" : dragging ? "lightgreen" : "transparent") : "transparent";
  return (
    <div
      ref={ref}
      style={{
        width: panelCount === 0 ? "100%" : "24px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: panelCount === 0 ? "100%" : "12px",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: backgroundColor,
          margin: "4px 0",
          boxShadow: dragging ? `0px 0px 12px ${backgroundColor}` : "none",
          borderRadius: "4px",
        }}
      >
        {panelCount === 0 && "Please drag and drop scenes here."}
      </div>
    </div>
  );
};
