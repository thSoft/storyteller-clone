import React from "react";
import { Character } from "../types";

export const CharacterView: React.FC<{
  character: Character | undefined;
  showName?: boolean;
  action?: string;
  style?: React.CSSProperties;
  wide?: boolean;
}> = ({ character, style, showName = true, action, wide }) => {
  const styling: React.CSSProperties = showName
    ? {
        padding: "4px",
        backgroundColor: "white",
        boxShadow: "2px 2px 4px 0 rgba(0, 0, 0, 0.2)",
        gap: "4px",
        border: "1px solid",
        height: "14vh",
      }
    : {};
  return (
    <div
      style={{
        bottom: 0,
        width: wide ? "12vw" : "6vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: showName ? "center" : "end",
        ...style,
        ...styling,
      }}
    >
      {character !== undefined && (
        <>
          <img
            src={`/characters/${character.id}/${action || (showName ? "portrait" : "default")}.png`}
            alt={character.name}
            style={{ width: "90%" }}
          />
          {showName && <div style={{ fontSize: "90%", textAlign: "center" }}>{character.name}</div>}
        </>
      )}
    </div>
  );
};
