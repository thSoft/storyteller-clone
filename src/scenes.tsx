import { entityMap, EntityMap } from "./entities";
import { arrest } from "./scenes/arrest";
import { confiscate } from "./scenes/confiscate";
import { die } from "./scenes/die";
import { disclose } from "./scenes/disclose";
import { disown } from "./scenes/disown";
import { eavesdrop } from "./scenes/eavesdrop";
import { fallInLove } from "./scenes/fallInLove";
import { impersonate } from "./scenes/impersonate";
import { orderHeist } from "./scenes/orderHeist";
import { orderHit } from "./scenes/orderHit";
import { recruit } from "./scenes/recruit";
import { robTheBank } from "./scenes/robTheBank";
import { shoot } from "./scenes/shoot";
import { showGun } from "./scenes/showGun";
import { takeOver } from "./scenes/takeover";
import { wearBulletproofVest } from "./scenes/wearBulletproofVest";

import { Scene } from "./types";

export const scenes: EntityMap<Scene> = entityMap([
  orderHit,
  orderHeist,
  recruit,
  shoot,
  disclose,
  robTheBank,
  eavesdrop,
  arrest,
  confiscate,
  disown,
  fallInLove,
  impersonate,
  wearBulletproofVest,
  showGun,
  die,
  takeOver,
]);

export const mafiaScenes = [
  orderHit,
  shoot,
  disclose,
  orderHeist,
  robTheBank,
  eavesdrop,
  confiscate,
  arrest,
  impersonate,
  showGun,
  wearBulletproofVest,
  recruit,
  fallInLove,
  disown,
  die,
  takeOver,
].map((scene) => scene.id);
