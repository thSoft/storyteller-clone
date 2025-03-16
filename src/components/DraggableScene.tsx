import React from "react";
import { useDrag } from "react-dnd";
import { SceneTemplate } from "../types";
import { ItemTypes } from "./ItemTypes";

// Draggable Scene Component
export const DraggableScene: React.FC<{ template: SceneTemplate }> = ({
  template,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SCENE,
    item: { templateId: template.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        margin: "4px",
        padding: "4px",
        border: "1px solid",
      }}
    >
      {template.name}
    </div>
  );
};
