import React from "react";
import { Scene } from "../types";

export function SceneImage({ scene, style }: { scene: Scene; style?: React.CSSProperties }) {
  return <img src={`/scenes/${scene.id}.png`} alt={scene.name} style={style} />;
}
