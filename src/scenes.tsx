import { attack } from "./scenes/attack";
import { begging } from "./scenes/begging";
import { death } from "./scenes/death";
import { duel } from "./scenes/duel";
import { escape } from "./scenes/escape";
import { love } from "./scenes/love";
import { seance } from "./scenes/seance";
import { EntityMap, Scene } from "./types";
import { entityMap } from "./utils";

export const scenes: EntityMap<Scene> = entityMap([
  love,
  death,
  duel,
  attack,
  escape,
  begging,
  seance,
]);
