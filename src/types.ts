import { StoryState } from "./storyState";

export type Entity = { id: string };

export type EntityMap<T extends Entity> = Record<string, T>;

export type Character = Entity & {
  name: string;
};

export type CharacterWithImpersonation = Character & {
  seemingly: Character;
  actually: Character;
};

export type CharacterPair = [string, string];

export type SceneSlot = Entity & {
  label: string;
  optional?: boolean;
};

export type Scene = Entity & {
  name: string;
  slots: SceneSlot[];
  outcomeLogic: (state: StoryState, assigned: Record<string, CharacterWithImpersonation>) => void;
};

export type Puzzle = Entity & {
  title: string;
  prompt: string;
  scenes: string[];
  characters: string[];
  isWinning: (state: StoryState) => boolean;
  initialStoryState: StoryState;
  maxPanelCount: number;
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
