import { alessio, donMarcello, donRomano } from "./characters";
import { Panel } from "./types";

export const initialStoryState = {
  event: undefined as string | undefined,
  dead: {} as Record<string, boolean>,
  heartbroken: {} as Record<string, boolean>,
  loves: {} as Record<string, string>,
  wantsToKill: { [donMarcello.id]: [alessio.id, donRomano.id] } as Record<
    string,
    string[]
  >,
  doesNotKill: { [donMarcello.id]: true } as Record<string, boolean>,
  personWithGun: donMarcello.id as string | undefined,
  angryAt: {} as Record<string, string>,
  spiteful: {} as Record<string, boolean>,
  awareOf: {} as Record<string, Panel>,
};

export type StoryState = typeof initialStoryState;
