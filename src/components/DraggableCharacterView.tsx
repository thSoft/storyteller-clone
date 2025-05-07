import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { Character } from "../types";
import { CharacterView } from "./CharacterView";
import { ItemTypes } from "./ItemTypes";

export const DraggableCharacterView: React.FC<{ character: Character; visible: boolean }> = ({
  character,
  visible,
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

  return visible ? (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}>
      <CharacterView character={character} />
    </div>
  ) : (
    <div
      style={{
        width: "6vw",
        height: "16vh",
      }}
    ></div>
  );
};
