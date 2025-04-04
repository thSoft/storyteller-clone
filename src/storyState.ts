import { grandma, hunter, red } from "./characters";

export const initialStoryState = {
  event: undefined as string | undefined,
  dead: {} as Record<string, boolean>,
  heartbroken: {} as Record<string, boolean>,
  loves: {} as Record<string, string>,
  distracted: {} as Record<string, boolean>,
  willingToGiveMoney: {} as Record<string, boolean>,
  hasMoney: {} as Record<string, boolean>,
  castleHealth: "intact" as "intact" | "cracked" | "collapsed",
  princessIsFree: false,
  dragonCanBreatheFire: true,
  knowsCodeOfSafe: {} as Record<string, boolean>,
  personWithGun: undefined as string | undefined,
  safeHasMoney: false,
  safeIsGuarded: true,
  guardFollowsDuchess: false,
  knowsLocationOfGrandma: {
    [grandma.id]: true,
    [red.id]: true,
    [hunter.id]: true,
  },
  knowsAboutWolf: {} as Record<string, boolean>,
};

export type StoryState = typeof initialStoryState;
