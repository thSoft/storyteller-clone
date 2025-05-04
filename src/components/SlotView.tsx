import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { characters } from "../characters";
import { OtherAction, Speech, Thought } from "../storyState";
import { SceneSlot } from "../types";
import { CharacterView } from "./CharacterView";
import { ItemTypes } from "./ItemTypes";

export const SlotView: React.FC<{
  slot: SceneSlot;
  index: number;
  assignedCharacter: string | undefined;
  onAssignCharacter: (characterId: string) => void;
  speech?: Speech;
  thought?: Thought;
  otherAction?: OtherAction;
}> = ({ slot, index, assignedCharacter, onAssignCharacter, speech, thought, otherAction }) => {
  const [{ dragging, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CHARACTER,
    drop: (item: { characterId: string }) => onAssignCharacter(item.characterId),
    collect: (monitor) => ({
      dragging: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));

  const ref = useRef<HTMLSpanElement>(null);
  drop(ref);

  const character = assignedCharacter ? characters[assignedCharacter] : undefined;

  function getSpeechBubble(filename: string, message: string) {
    return (
      <div
        style={{
          width: "140px",
          height: "120px",
          backgroundImage: `url(/bubbles/${filename}.svg)`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "1cqh", width: "80%", textAlign: "center" }}>{message}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "10px 0" }}>
      <div style={{ fontSize: "90%", textAlign: "center", height: "20px" }}>
        {slot.label}
        {slot.optional ? " (optional)" : ""}:{" "}
      </div>
      {speech && getSpeechBubble(speech.style || "speech", speech.message)}
      {thought && getSpeechBubble("thought", thought.message)}
      <span
        ref={ref}
        style={{
          backgroundColor: isOver ? "yellow" : dragging ? "lightgreen" : "white",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: index % 2 === 1 ? "scaleX(-1)" : "none",
        }}
      >
        <CharacterView character={character} showName={false} action={otherAction?.action} />
      </span>
    </div>
  );
};
