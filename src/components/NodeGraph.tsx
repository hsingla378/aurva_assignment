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
  Handle,
  Position,
} from "@xyflow/react";
import ExploreNode from "./ExploreNode";
import CategoryNode from "./CategoryNode";
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
      type: "category",
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
  }, [exploreClicked, setNodes, setEdges, fitView]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = {
    explore: ExploreNode,
    category: CategoryNode,
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        onNodeClick={(event, node) => {
          if (node.id === "1") {
            handleExploreClick();
          }
        }}
      >
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}

export default NodeGraph;
