import { attack } from "./scenes/attack";
import { ballroom } from "./scenes/ballroom";
import { begging } from "./scenes/begging";
import { death } from "./scenes/death";
import { duel } from "./scenes/duel";
import { escape } from "./scenes/escape";
import { forest } from "./scenes/forest";
import { grandmasHouse } from "./scenes/grandmasHouse";
import { gun } from "./scenes/gun";
import { love } from "./scenes/love";
import { safe } from "./scenes/safe";
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
  safe,
  gun,
  ballroom,
  forest,
  grandmasHouse,
]);
