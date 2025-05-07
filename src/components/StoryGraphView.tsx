import Graph from "graphology";
import { circular } from "graphology-layout";
import { useEffect, useRef } from "react";
import { characters } from "../characters";
import { StoryState } from "../storyState";

interface StoryGraphViewProps {
  graph: StoryState;
  width: number;
  height: number;
}

interface NodePosition {
  x: number;
  y: number;
}

export const StoryGraphView: React.FC<StoryGraphViewProps> = ({ graph, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Clear the canvas
    context.clearRect(0, 0, width, height);

    // Create a copy of the graph with positions
    const layoutGraph = graph.copy();

    // Apply circular layout to the copy
    circular.assign(layoutGraph, {
      center: width / 2,
      scale: Math.min(width, height) * 0.4, // Use 40% of the smaller dimension as radius
    });

    // Find the bounds of the graph
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    layoutGraph.forEachNode((node) => {
      const pos = layoutGraph.getNodeAttributes(node) as NodePosition;
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x);
      maxY = Math.max(maxY, pos.y);
    });

    // Calculate scaling factors to fit the graph in the canvas
    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const scaleX = (width * 0.8) / graphWidth; // Use 80% of canvas width
    const scaleY = (height * 0.8) / graphHeight; // Use 80% of canvas height
    const scale = Math.min(scaleX, scaleY);

    // Calculate center offset
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Set up canvas context
    context.lineWidth = 2;
    context.font = "12px Arial";
    context.textAlign = "left";
    context.textBaseline = "top";

    // Draw graph attributes in top left corner
    const graphAttributes = Object.entries(graph.getAttributes())
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);

    context.fillStyle = "#000000";
    const lineHeight = 15;
    graphAttributes.forEach((line, i) => {
      context.fillText(line, 10, 10 + i * lineHeight);
    });

    // Reset text alignment for nodes and edges
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Draw edges
    // First, group edges by source and target
    const edgeGroups = new Map<string, string[]>();
    layoutGraph.forEachEdge((edge, _, source, target) => {
      const key = `${source}-${target}`;
      const originalAttributes = graph.getEdgeAttributes(edge);
      const edgeType = originalAttributes.type;
      if (edgeType) {
        if (!edgeGroups.has(key)) {
          edgeGroups.set(key, []);
        }
        edgeGroups.get(key)!.push(edgeType);
      }
    });

    // Draw edges and consolidated labels
    layoutGraph.forEachEdge((_0, _1, source, target) => {
      const sourcePos = layoutGraph.getNodeAttributes(source) as NodePosition;
      const targetPos = layoutGraph.getNodeAttributes(target) as NodePosition;

      // Scale and center the coordinates
      const x1 = (sourcePos.x - centerX) * scale + width / 2;
      const y1 = (sourcePos.y - centerY) * scale + height / 2;
      const x2 = (targetPos.x - centerX) * scale + width / 2;
      const y2 = (targetPos.y - centerY) * scale + height / 2;

      // Calculate the angle of the edge
      const angle = Math.atan2(y2 - y1, x2 - x1);

      // Draw edge line
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.strokeStyle = "#888888";
      context.stroke();

      // Draw arrowhead
      const arrowSize = 10;
      const arrowAngle = Math.PI / 6; // 30 degrees

      // Calculate arrow points
      const arrowX1 = x2 - arrowSize * Math.cos(angle - arrowAngle);
      const arrowY1 = y2 - arrowSize * Math.sin(angle - arrowAngle);
      const arrowX2 = x2 - arrowSize * Math.cos(angle + arrowAngle);
      const arrowY2 = y2 - arrowSize * Math.sin(angle + arrowAngle);

      // Draw arrow
      context.beginPath();
      context.moveTo(x2, y2);
      context.lineTo(arrowX1, arrowY1);
      context.lineTo(arrowX2, arrowY2);
      context.closePath();
      context.fillStyle = "#888888";
      context.fill();

      // Draw consolidated edge label
      const key = `${source}-${target}`;
      const types = edgeGroups.get(key);
      if (types) {
        // Calculate midpoint for label
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        // Draw label background
        const labelText = types.join(", ");
        const textWidth = context.measureText(labelText).width;
        const padding = 0;
        context.fillStyle = "#ffffff";
        context.fillRect(
          midX - textWidth / 2 - padding,
          midY - lineHeight / 2 - padding,
          textWidth + padding * 2,
          lineHeight + padding * 2
        );

        // Draw label text
        context.fillStyle = "#888888";
        context.fillText(labelText, midX, midY);

        // Remove this group so we don't draw it again
        edgeGroups.delete(key);
      }
    });

    // Draw nodes
    layoutGraph.forEachNode((node) => {
      const pos = layoutGraph.getNodeAttributes(node) as NodePosition;

      // Scale and center the coordinates
      const x = (pos.x - centerX) * scale + width / 2;
      const y = (pos.y - centerY) * scale + height / 2;

      // Draw node circle
      context.beginPath();
      context.arc(x, y, 3, 0, 2 * Math.PI);
      context.fillStyle = "#ccc";
      context.fill();
      context.strokeStyle = "#000000";
      context.stroke();

      // Draw node label
      const originalAttributes = graph.getNodeAttributes(node);
      const lines = [
        characters[node]?.name || node,
        "",
        ...Object.entries(originalAttributes)
          .filter(([_, value]) => value !== undefined && value !== null && !(value instanceof Graph))
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`),
      ];

      context.fillStyle = "#000000";
      lines.forEach((line, i) => {
        context.fillText(line, x, y - ((lines.length - 1) * lineHeight) / 2 + i * lineHeight);
      });
    });
  }, [graph, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: "1px solid #ccc",
        backgroundColor: "white",
        marginTop: "8px",
      }}
    />
  );
};
