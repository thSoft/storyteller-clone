import Graph, { MultiDirectedGraph } from "graphology";
import { alessio, bruno, characters, donMarcello, donRomano, vincenzo } from "./characters";
import { addRelation, setState } from "./scenes/sceneUtils";

export type RelationType = "wantsToKill" | "obeys" | "loves" | "angryAt" | "isBoundByDealWith";

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
}

export type Thought =
  | {
      type: "killed";
      killerId: string;
      victimId: string;
    }
  | {
      type: "robbed";
      thiefId: string | undefined;
    };

export interface GraphAttributes {
  personWithGun?: string;
  bankRobbed?: boolean;
}

export interface StoryState {
  event: string | undefined;
  graph: StoryGraph;
}

export type StoryGraph = Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export function getInitialStoryState(): StoryState {
  const graph = createGraph();
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
  setState(result, donMarcello.id, "doesNotKill", true);
  addRelation(result, donMarcello.id, "wantsToKill", alessio.id);
  addRelation(result, vincenzo.id, "obeys", donMarcello.id);
  setState(result, donRomano.id, "doesNotSteal", true);
  setState(result, donRomano.id, "knowsSecretCode", true);
  addRelation(result, bruno.id, "obeys", donRomano.id);
  return result;
}

function createGraph() {
  return new MultiDirectedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>();
}

export function cloneGraph(graph: StoryGraph): StoryGraph {
  const newGraph = createGraph();
  newGraph.mergeAttributes(graph.getAttributes());
  graph.forEachNode((node) => {
    newGraph.addNode(node, { ...graph.getNodeAttributes(node) });
  });
  graph.forEachEdge((_0, edgeAttributes, source, target, _1, _2, undirected) => {
    if (undirected) {
      newGraph.addUndirectedEdge(source, target, { ...edgeAttributes });
    } else {
      newGraph.addDirectedEdge(source, target, { ...edgeAttributes });
    }
  });
  return newGraph;
}
