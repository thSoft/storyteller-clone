import { confrontation } from "./scenes/confrontation";
import { deal } from "./scenes/deal";
import { death } from "./scenes/death";
import { disclose } from "./scenes/disclose";
import { eavesdrop } from "./scenes/eavesdrop";
import { heist } from "./scenes/heist";
import { hit } from "./scenes/hit";
import { love } from "./scenes/love";
import { EntityMap, Scene } from "./types";
import { entityMap } from "./utils";

export const scenes: EntityMap<Scene> = entityMap([love, death, deal, hit, disclose, heist, eavesdrop, confrontation]);
