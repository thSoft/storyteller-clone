import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { characters } from "../characters";
import { SceneSlot } from "../types";
import { CharacterView } from "./CharacterView";
import { ItemTypes } from "./ItemTypes";

export const SlotView: React.FC<{
  slot: SceneSlot;
  assignedCharacter: string | undefined;
  onAssignCharacter: (characterId: string) => void;
}> = ({ slot, assignedCharacter, onAssignCharacter }) => {
  const [{ dragging, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CHARACTER,
    drop: (item: { characterId: string }) => onAssignCharacter(item.characterId),
    collect: (monitor) => ({
      dragging: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));

  const ref = useRef<HTMLSpanElement>(null);
  drop(ref);

  const character = assignedCharacter ? characters[assignedCharacter] : undefined;
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "10px 0" }}>
      <div style={{ fontSize: "90%", textAlign: "center", height: "20px" }}>
        {slot.label}
        {slot.optional ? " (optional)" : ""}:{" "}
      </div>
      <span
        ref={ref}
        style={{
          backgroundColor: isOver ? "yellow" : dragging ? "lightgreen" : "white",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CharacterView character={character} />
      </span>
    </div>
  );
};
