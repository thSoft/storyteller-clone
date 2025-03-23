import { attack } from "./scenes/attack";
import { death } from "./scenes/death";
import { duel } from "./scenes/duel";
import { escape } from "./scenes/escape";
import { love } from "./scenes/love";
import { EntityMap, Scene } from "./types";
import { entityMap } from "./utils";

export const scenes: EntityMap<Scene> = entityMap([
  love,
  death,
  duel,
  attack,
  escape,
]);
