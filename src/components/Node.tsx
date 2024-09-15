import { NodeProps } from "@xyflow/react";
import React from "react";
import { getNodeStyle } from "../utils/constant";

const Node: React.FC<NodeProps> = ({ data, type }) => {
  const { border, backgroundColor, icon: Icon } = getNodeStyle(type);

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
      {Icon && <Icon />}
      <strong>{data.label}</strong>
    </div>
  );
};

export default Node;
