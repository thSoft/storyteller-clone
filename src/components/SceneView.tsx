import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { Scene } from "../types";
import { ItemTypes } from "./ItemTypes";

export const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SCENE,
    item: { sceneId: scene.id },
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
        lineHeight: "1.5",
        border: "1px solid",
        width: "110px",
      }}
    >
      {scene.name}
    </div>
  );
};
