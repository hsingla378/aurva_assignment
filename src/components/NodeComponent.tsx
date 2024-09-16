import { NodeProps as XyflowNodeProps, Handle, Position } from "@xyflow/react";
import React from "react";
import { getNodeStyle } from "../utils/constant";

const NodeComponent: React.FC<XyflowNodeProps> = ({ data, type }) => {
  const { border, backgroundColor, icon: Icon } = getNodeStyle(type);

  return (
    <div
      style={{
        border,
        backgroundColor,
        ...(data?.style || {}),
      }}
      className="p-2 rounded-lg w-auto flex items-center gap-2 max-w-56"
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />
      {Icon && <Icon />}
      <strong>{data?.label as string}</strong>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};

export default NodeComponent;
