import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { Character } from "../types";
import { ItemTypes } from "./ItemTypes";

export const CharacterView: React.FC<{ character: Character }> = ({
  character,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHARACTER,
    item: { characterId: character.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null);
  drag(ref);

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        margin: "4px",
        padding: "4px",
        border: "1px solid",
      }}
    >
      {character.name}
    </div>
  );
};
