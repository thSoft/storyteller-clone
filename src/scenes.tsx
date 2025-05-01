import { entityMap, EntityMap } from "./entities";
import { confrontation } from "./scenes/confrontation";
import { deal } from "./scenes/deal";
import { death } from "./scenes/death";
import { disclose } from "./scenes/disclose";
import { eavesdrop } from "./scenes/eavesdrop";
import { heist } from "./scenes/heist";
import { hit } from "./scenes/hit";
import { impersonate } from "./scenes/impersonate";
import { love } from "./scenes/love";
import { shield } from "./scenes/shield";
import { takeover } from "./scenes/takeover";
import { Scene } from "./types";

export const scenes: EntityMap<Scene> = entityMap([
  love,
  death,
  deal,
  hit,
  disclose,
  heist,
  eavesdrop,
  confrontation,
  shield,
  takeover,
  impersonate,
]);

export const mafiaScenes = [
  love,
  death,
  deal,
  hit,
  disclose,
  heist,
  eavesdrop,
  confrontation,
  shield,
  takeover,
  impersonate,
].map((scene) => scene.id);
