import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { characters } from "../characters";
import { SceneSlot } from "../types";
import { ItemTypes } from "./ItemTypes";

export const SlotView: React.FC<{
  slot: SceneSlot;
  assignedCharacter: string | undefined;
  onAssignCharacter: (characterId: string) => void;
}> = ({ slot, assignedCharacter, onAssignCharacter }) => {
  const [{ dragging }, drop] = useDrop(() => ({
    accept: ItemTypes.CHARACTER,
    drop: (item: { characterId: string }) => onAssignCharacter(item.characterId),
    collect: (monitor) => ({
      dragging: monitor.canDrop(),
    }),
  }));

  const ref = useRef<HTMLSpanElement>(null);
  drop(ref);

  const character = assignedCharacter ? characters[assignedCharacter] : undefined;
  return (
    <div style={{ margin: "10px 0" }}>
      {slot.label}
      {slot.optional ? " (optional)" : ""}:{" "}
      <span
        ref={ref}
        style={{
          backgroundColor: dragging ? "lightblue" : "white",
          padding: "4px",
          border: `1px ${character ? "solid black" : "dashed gray"}`,
          lineHeight: 1.3,
        }}
      >
        {assignedCharacter ? character?.name : "(nobody)"}
      </span>
    </div>
  );
};
