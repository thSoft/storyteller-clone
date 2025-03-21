import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { addPanelToCurrentPuzzle } from "../gameStateSlice";
import { ItemTypes } from "./ItemTypes";

export const InsertionPoint: React.FC<{
  index: number;
}> = ({ index }) => {
  const dispatch = useDispatch();
  const handleInsertPanel = (index: number, sceneId: string) => {
    dispatch(
      addPanelToCurrentPuzzle({
        panel: {
          sceneId,
          slotAssignedCharacters: {},
        },
        index: index,
      })
    );
  };
  const [{ dragging }, drop] = useDrop(() => ({
    accept: ItemTypes.SCENE,
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
        backgroundColor: dragging ? "lightgreen" : "transparent",
        margin: "4px 0",
      }}
    />
  );
};
