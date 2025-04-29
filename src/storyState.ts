import Graph, { MultiDirectedGraph } from "graphology";
import {
  alessio,
  bruno,
  characters,
  donMarcello,
  donRomano,
  inspectorRinaldi,
  lucia,
  nico,
  vincenzo,
} from "./characters";
import { addRelation, setState } from "./scenes/sceneUtils";

export type RelationType =
  | "wantsToKill"
  | "obeys"
  | "loves"
  | "angryAt"
  | "isBoundByDealWith"
  | "childOf"
  | "impersonates";

export interface EdgeAttributes {
  type: RelationType;
}

export interface NodeAttributes {
  doesNotKill?: boolean;
  dead?: boolean;
  heartbroken?: boolean;
  spiteful?: boolean;
  awareOf?: Thought;
  content?: boolean;
  doesNotSteal?: boolean;
  knowsSecretCode?: boolean;
  fired?: boolean;
  rewarded?: boolean;
  arrested?: boolean;
  worksForPolice?: boolean;
  protectedFromMurder?: boolean;
  headOfFamily?: boolean;
  successors?: string[];
  disowned?: boolean;
  shockedByGun?: boolean;
  shockedByAlive?: boolean;
  sex?: "male" | "female";
}

export type Thought =
  | { type: "killed"; killerId?: string; victimId: string }
  | { type: "robbed"; thiefId: string | undefined }
  | { type: "deal"; ordererId: string; executorId: string; targetId?: string }
  | { type: "loves"; lover1Id: string; lover2Id: string }
  | { type: "confiscated"; confiscatorId: string; confiscatedId: string };

export interface GraphAttributes {
  personWithGun?: string;
  bankRobbed?: boolean;
  eavesdropperId?: string;
}

export interface StoryState {
  event: string | undefined;
  graph: StoryGraph;
}

export type StoryGraph = Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export function getInitialStoryState(): StoryState {
  const graph = new MultiDirectedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>();
  // Add all characters as nodes
  Object.keys(characters).forEach((characterId) => {
    graph.addNode(characterId);
  });
  const result = {
    event: undefined,
    graph,
  };
  // Initialize the initial state
  graph.setAttribute("personWithGun", donMarcello.id);
  setState(result, donMarcello.id, "headOfFamily", true);
  setState(result, donMarcello.id, "doesNotKill", true);
  addRelation(result, donMarcello.id, "wantsToKill", alessio.id);
  addRelation(result, vincenzo.id, "obeys", donMarcello.id);
  setState(result, donMarcello.id, "successors", [nico.id, vincenzo.id, lucia.id]);
  addRelation(result, nico.id, "childOf", donMarcello.id);
  addRelation(result, lucia.id, "childOf", donMarcello.id);
  setState(result, lucia.id, "sex", "female");

  setState(result, donRomano.id, "headOfFamily", true);
  setState(result, donRomano.id, "doesNotSteal", true);
  setState(result, donRomano.id, "doesNotKill", true);
  setState(result, donRomano.id, "knowsSecretCode", true);
  addRelation(result, bruno.id, "obeys", donRomano.id);
  addRelation(result, alessio.id, "obeys", donMarcello.id);
  addRelation(result, alessio.id, "childOf", donMarcello.id);

  setState(result, inspectorRinaldi.id, "worksForPolice", true);
  return result;
}
