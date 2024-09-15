import { NodeProps, Handle, Position } from "@xyflow/react";
import React from "react";
import { getNodeStyle } from "../utils/constant";

const CategoryNode: React.FC<NodeProps> = ({ data }) => {
  const { border, backgroundColor, icon: Icon } = getNodeStyle("category");

  return (
    <div
      style={{
        padding: ".5em",
        border,
        backgroundColor,
        borderRadius: "8px",
        width: "auto",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        gap: ".5rem",
        ...data.style,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Icon />
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};

export default CategoryNode;
