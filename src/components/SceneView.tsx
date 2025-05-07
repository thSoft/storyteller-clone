import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { Scene } from "../types";
import { ItemTypes } from "./ItemTypes";

export const SceneView: React.FC<{ scene: Scene; visible: boolean }> = ({ scene, visible }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SCENE,
    item: { sceneId: scene.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null);
  drag(ref);

  const styling: React.CSSProperties = visible
    ? {
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        padding: "4px",
        border: "1px solid",

        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        boxShadow: "2px 2px 4px 0 rgba(0, 0, 0, 0.2)",
      }
    : {};
  return (
    <div ref={ref} style={{ width: "6vw", height: "4vw", ...styling }}>
      {visible && scene.name}
    </div>
  );
};
