import { NodeProps as XyflowNodeProps, Handle, Position } from "@xyflow/react";
import React, { useState } from "react";
import { getNodeStyle } from "../utils/constant";

const NodeComponent: React.FC<XyflowNodeProps> = ({ data, type }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const {
    border,
    backgroundColor,
    icon: Icon,
    iconColor,
    hover,
    padding,
  } = getNodeStyle(type);

  return (
    <div
      style={{
        border,
        backgroundColor: isHovered ? hover.backgroundColor : backgroundColor,
        padding,
        boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
        transition: "all 0.3s ease",
        transform: isHovered ? hover.transform : "scale(1)",
        cursor: isDragging ? "grabbing" : "pointer",
        ...(data?.style || {}),
      }}
      className="p-2 flex items-center gap-1 max-w-48 rounded-3xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />
      {Icon && <Icon style={{ color: iconColor, fontSize: ".75rem" }} />}{" "}
      <strong style={{ fontSize: "0.5rem" }}>{data?.label as string}</strong>{" "}
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};

export default NodeComponent;
