import React from "react";
import { Character } from "../types";

export const CharacterView: React.FC<{
  character: Character | undefined;
  showName?: boolean;
  action?: string;
  style?: React.CSSProperties;
}> = ({ character, style, showName = true, action }) => {
  const styling: React.CSSProperties = showName
    ? {
        padding: "4px",
        backgroundColor: "white",
        boxShadow: "2px 2px 4px 0 rgba(0, 0, 0, 0.2)",
        gap: "4px",
        border: "1px solid",
      }
    : { border: character ? "none" : "1px dashed" };
  return (
    <div
      style={{
        width: "110px",
        height: "140px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...style,
        ...styling,
      }}
    >
      {character ? (
        <>
          <img
            src={`/characters/${character.id}/${action || (showName ? "portrait" : "default")}.png`}
            alt={character.name}
            style={{ width: "100px" }}
          />
          {showName && <div style={{ fontSize: "90%", textAlign: "center" }}>{character.name}</div>}
        </>
      ) : (
        "?"
      )}
    </div>
  );
};
