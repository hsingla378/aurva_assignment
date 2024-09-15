import React, { useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  ReactFlowProvider,
  Connection,
} from "@xyflow/react";
import Node from "./Node";

import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "1",
    position: { x: 300, y: 50 },
    data: {
      label: "Explore",
      icon: "globe",
      style: {
        border: "1px solid #f0f0f0",
        backgroundColor: "#fafafa",
        padding: 10,
      },
    },
    type: "custom",
  },
];

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

function NodeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = {
    custom: Node,
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        />
      </ReactFlowProvider>
    </div>
  );
}

export default NodeGraph;
