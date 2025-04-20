import Graph from "graphology";
import {
  alessio,
  characters,
  donMarcello,
  donRomano,
  vincenzo,
} from "./characters";

export type RelationType =
  | "wantsToKill"
  | "obeys"
  | "loves"
  | "angryAt"
  | "awareOf";

export interface EdgeAttributes {
  type: RelationType;
}

interface NodeAttributes {
  doesNotKill?: boolean;
  dead?: boolean;
  heartbroken?: boolean;
  spiteful?: boolean;
}

interface GraphAttributes {
  personWithGun?: string;
}

export interface StoryState {
  event: string | undefined;
  graph: StoryGraph;
}

export type StoryGraph = Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export function getInitialStoryState(): StoryState {
  const graph = new Graph<NodeAttributes, EdgeAttributes, GraphAttributes>();
  // Add all characters as nodes
  Object.keys(characters).forEach((characterId) => {
    graph.addNode(characterId);
  });
  // Initialize the initial state
  graph.setAttribute("personWithGun", donMarcello.id);
  graph.setNodeAttribute(donMarcello.id, "doesNotKill", true);
  graph.addDirectedEdge(donMarcello.id, alessio.id, {
    type: "wantsToKill",
  });
  graph.addDirectedEdge(donMarcello.id, donRomano.id, {
    type: "wantsToKill",
  });
  graph.addDirectedEdge(vincenzo.id, donMarcello.id, {
    type: "obeys",
  });
  return {
    event: undefined,
    graph,
  };
}

export function cloneGraph(graph: StoryGraph): StoryGraph {
  const newGraph = new Graph<NodeAttributes, EdgeAttributes, GraphAttributes>();
  newGraph.mergeAttributes(graph.getAttributes());
  graph.forEachNode((node) => {
    newGraph.addNode(node, { ...graph.getNodeAttributes(node) });
  });
  graph.forEachEdge(
    (_0, edgeAttributes, source, target, _1, _2, undirected) => {
      if (undirected) {
        newGraph.addUndirectedEdge(source, target, { ...edgeAttributes });
      } else {
        newGraph.addDirectedEdge(source, target, { ...edgeAttributes });
      }
    }
  );
  return newGraph;
}
