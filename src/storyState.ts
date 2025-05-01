import Graph from "graphology";
import { Entity } from "./entities";

export type NodeAttributes = {
  dead?: boolean;
  spiteful?: boolean;
  arrested?: boolean;
  disowned?: boolean;
  shockedByAlive?: boolean;
  shockedByGun?: boolean;
  content?: boolean;
  promoted?: boolean;
  rewarded?: boolean;
  fired?: boolean;
  heartbroken?: boolean;
  headOfFamily?: boolean;
  doesNotKill?: boolean;
  doesNotSteal?: boolean;
  knowsSecretCode?: boolean;
  worksForPolice?: boolean;
  sex?: "male" | "female";
  successors?: Entity[];
  protectedFromMurder?: boolean;
  believedStoryState?: StoryState;
};

export type EdgeAttributes = {
  type: RelationType;
};

export type GraphAttributes = {
  gunOwner?: Entity;
  bankRobber?: Entity;
  eavesdropper?: Entity;
  event?: string;
};

export type RelationType =
  | "wantsToKill"
  | "obeys"
  | "childOf"
  | "loves"
  | "impersonates"
  | "angryAt"
  | "promisedMurderTo"
  | "promisedHeistTo"
  | "killed";

export type StoryState = Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
