import { Entity } from "./entities";
import { StateProxy } from "./stateProxy";
import { StoryState } from "./storyState";

export type Character = Entity & {
  name: string;
};

export type SceneSlot = Entity & {
  label: string;
  optional?: boolean;
  hint?: string;
  nonParticipant?: boolean;
};

export type Scene = Entity & {
  name: string;
  slots: SceneSlot[];
  outcomeLogic: (state: StateProxy, assigned: Record<string, Character>) => void;
  color?: string;
};

export type Puzzle = Entity & {
  title: string;
  prompt: string;
  scenes: string[];
  characters: string[];
  isWinning: (state: StateProxy) => boolean;
  initialStoryState: StoryState;
  maxPanelCount: number;
  dependsOn?: string[];
};

export type Book = Entity & {
  title: string;
  puzzles: string[];
};

export type Panel = {
  sceneId: string;
  slotAssignedCharacters: Record<string, string>;
};

export type PuzzleState = {
  panels: Panel[];
  completed?: boolean;
};

export type GameState = {
  currentBookId: string | null;
  currentPuzzleId: string | null;
  puzzleStates: Record<string, PuzzleState>;
};
