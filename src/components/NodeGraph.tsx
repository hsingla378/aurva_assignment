import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  useReactFlow,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import Node from "./Node";
import { fetchMealCategories } from "../utils/api";
import { MealCategory } from "../utils/types";

import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "1",
    position: { x: 300, y: 50 },
    data: {
      label: "Explore",
    },
    type: "explore",
  },
];

const initialEdges: Edge[] = [];

function NodeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [exploreClicked, setExploreClicked] = useState(false);

  const { fitView } = useReactFlow();

  // Parent-Child relationships tracker
  const [parentChildMap, setParentChildMap] = useState<
    Record<string, string[]>
  >({});

  // Fetch categories and create new nodes and edges
  const handleExploreClick = useCallback(async () => {
    if (exploreClicked) return;
    setExploreClicked(true);

    const categories: MealCategory[] = await fetchMealCategories();

    // Generate category nodes with unique IDs
    const newNodes = categories.map((category, index) => ({
      id: `category-${category.idCategory}`,
      position: { x: 600, y: 50 + index * 120 },
      data: {
        label: category.strCategory,
      },
      type: "category", // Pass the "category" type
    }));

    // Generate edges that connect the "Explore" node to each category node
    const newEdges = categories.map((category) => ({
      id: `e1-category-${category.idCategory}`,
      source: "1",
      target: `category-${category.idCategory}`,
    }));

    // Add new nodes and preserve the "Explore" node
    setNodes((existingNodes) => [...existingNodes, ...newNodes]);

    // Add edges between Explore and categories
    setEdges((existingEdges) => [...existingEdges, ...newEdges]);

    // Adjust the graph to fit all the nodes
    setTimeout(() => {
      fitView({ padding: 0.1, duration: 500 });
    }, 200);
  }, [exploreClicked]);

  // Handle click on any node, including categories
  const handleNodeClick = useCallback(
    (event, node) => {
      if (node.id === "1") {
        handleExploreClick();
      } else if (node.type === "category") {
        const viewMealsNodeId = `view-meals-${node.id}`;

        // Check if we have child nodes for this category in the parentChildMap
        if (parentChildMap[node.id]) {
          // Remove child nodes if they are already visible (collapse)
          const childNodes = parentChildMap[node.id];

          setNodes((existingNodes) =>
            existingNodes.filter((n) => !childNodes.includes(n.id))
          );

          setEdges((existingEdges) =>
            existingEdges.filter((e) => !childNodes.includes(e.target))
          );

          // Update the parent-child map to remove the entry
          const newMap = { ...parentChildMap };
          delete newMap[node.id];
          setParentChildMap(newMap);
        } else {
          // Add "View Meals" node (expand)
          const viewMealsNode = {
            id: viewMealsNodeId,
            position: { x: node.position.x + 300, y: node.position.y },
            data: {
              label: "View Meals",
            },
            type: "viewMeals",
          };

          // Create an edge from the category to the "View Meals" node
          const viewMealsEdge = {
            id: `e-${node.id}-view-meals`,
            source: node.id,
            target: viewMealsNodeId,
          };

          // Add new node and edge
          setNodes((existingNodes) => [...existingNodes, viewMealsNode]);
          setEdges((existingEdges) => [...existingEdges, viewMealsEdge]);

          // Track the child node
          setParentChildMap((prevMap) => ({
            ...prevMap,
            [node.id]: [viewMealsNodeId],
          }));

          setTimeout(() => {
            fitView({ padding: 0.1, duration: 500 });
          }, 200);
        }
      }
    },
    [nodes, parentChildMap]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [edges]
  );

  const nodeTypes = {
    explore: Node,
    category: Node,
    viewMeals: Node,
  };

  return (
    <div className="w-screen h-screen transition-all">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        onNodeClick={handleNodeClick}
      >
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}

export default NodeGraph;
