import { NodeProps, Handle, Position } from "@xyflow/react";
import React from "react";
import { getNodeStyle } from "../utils/constant";

const Node: React.FC<NodeProps> = ({ data, type }) => {
  const { border, backgroundColor, icon: Icon } = getNodeStyle(type);

  return (
    <div
      style={{
        border,
        backgroundColor,
        ...data.style,
      }}
      className="p-2 rounded-lg w-auto text-center flex items-center gap-2"
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />
      {Icon && <Icon />}
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};

export default Node;
