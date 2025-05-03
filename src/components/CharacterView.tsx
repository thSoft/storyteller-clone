import React from "react";
import { Character } from "../types";

export const CharacterView: React.FC<{
  character: Character | undefined;
  style?: React.CSSProperties;
}> = ({ character, style }) => {
  return (
    <div
      style={{
        padding: "4px",
        border: character ? "1px solid" : "1px dashed",
        backgroundColor: "white",
        boxShadow: "2px 2px 4px 0 rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        width: "110px",
        height: "140px",
        justifyContent: "center",
        ...style,
      }}
    >
      {character ? (
        <>
          <img src={`/characters/${character.id}.png`} alt={character.name} style={{ width: "100px" }} />
          <div style={{ fontSize: "90%", textAlign: "center" }}>{character.name}</div>
        </>
      ) : (
        "?"
      )}
    </div>
  );
};
