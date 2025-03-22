export type Entity = { id: string };

export type EntityMap<T extends Entity> = Record<string, T>;

export type Character = Entity & {
  name: string;
};

export type CharacterPair = [string, string];

export type SceneSlot = Entity & {
  label: string;
};

export const initialStoryState = {
  dead: {} as Record<string, boolean>,
  heartbroken: {} as Record<string, boolean>,
  loves: {} as Record<string, string>,
  distracted: {} as Record<string, boolean>,
  castleHealth: "intact" as "intact" | "cracked" | "collapsed",
  princessIsFree: false,
  dragonCanBreatheFire: true,
  event: undefined as string | undefined,
};

export type StoryState = typeof initialStoryState;

export type Scene = Entity & {
  name: string;
  slots: SceneSlot[];
  outcomeLogic: (
    state: StoryState,
    assigned: Record<string, Character>
  ) => void;
};

export type Puzzle = Entity & {
  title: string;
  prompt: string;
  scenes: string[];
  characters: string[];
  isWinning: (state: StoryState) => boolean;
  initialStoryState: StoryState;
};

export type Chapter = Entity & {
  title: string;
  puzzles: string[];
};

export type Panel = {
  sceneId: string;
  slotAssignedCharacters: Record<string, string>;
};

export type PuzzleState = {
  panels: Panel[];
};

export type GameState = {
  currentChapterId: string | null;
  currentPuzzleId: string | null;
  puzzleStates: Record<string, PuzzleState>;
};
