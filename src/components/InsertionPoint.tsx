import React from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { addStoryBeatToCurrentPuzzle } from "../gameStateSlice";
import { ItemTypes } from "./ItemTypes";

export const InsertionPoint: React.FC<{
  index: number;
}> = ({ index }) => {
  const dispatch = useDispatch();
  const handleInsertBeat = (index: number, templateId: string) => {
    dispatch(
      addStoryBeatToCurrentPuzzle({
        beat: {
          templateId,
          slotAssignedCharacters: {},
        },
        index: index,
      })
    );
  };
  const [{ dragging }, drop] = useDrop(() => ({
    accept: ItemTypes.SCENE,
    drop: (item: { templateId: string }) =>
      handleInsertBeat(index, item.templateId),
    collect: (monitor) => ({
      dragging: !!monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        height: "16px",
        backgroundColor: dragging ? "lightgreen" : "transparent",
        margin: "4px 0",
      }}
    />
  );
};
