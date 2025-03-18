import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { SceneTemplate } from "../types";
import { ItemTypes } from "./ItemTypes";

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
      {template.name}
    </div>
  );
};
