import { grandma, hunter, isobel, lenora, red, wolf } from "./characters";

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
  spiteful: {
    [isobel.id]: true,
    [lenora.id]: true,
  } as Record<string, boolean>,
  willingToKill: {
    [lenora.id]: true,
  } as Record<string, boolean>,
  angryAt: {} as Record<string, string>,
  kidnapped: undefined as string | undefined,
  wineIsPoisonedBy: undefined as string | undefined,
  drunk: {} as Record<string, boolean>,
  fullMoon: false,
  canBecomeWerewolf: {
    [red.id]: true,
  },
  wolfLike: { [wolf.id]: true },
  bullets: { [hunter.id]: 1 },
  disappointed: {} as Record<string, boolean>,
};

export type StoryState = typeof initialStoryState;
