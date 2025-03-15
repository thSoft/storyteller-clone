export type Entity = { id: string };

export type EntityMap<T extends Entity> = Record<string, T>;

export type Character = Entity & {
  name: string;
};

export type CharacterState = "dead" | "heartbroken";

export type CharacterPair = [string, string];

export type SceneSlot = Entity & {
  label: string;
};

export type StoryState = {
  characterStates: Record<string, Set<CharacterState>>;
  loveRelationships: Set<CharacterPair>;
  event: string;
};

export type SceneTemplate = Entity & {
  name: string;
  slots: SceneSlot[];
  outcomeLogic: (
    state: StoryState,
    assigned: Record<string, string>
  ) => StoryState;
};

export type Puzzle = Entity & {
  title: string;
  sceneTemplates: string[];
  characters: string[];
  isWinning: (state: StoryState) => boolean;
  initialStoryState: StoryState;
};

export type StoryBeat = {
  templateId: string;
  slotAssignedCharacters: Record<string, string>;
};

export type PuzzleState = {
  storyBeats: StoryBeat[];
};

export type GameState = {
  currentPuzzleId: string;
  puzzleStates: Record<string, PuzzleState>;
};
