import React from "react";
import { CiGlobe } from "react-icons/ci";

interface NodeProps {
  data: {
    label: string;
    icon?: string;
    style?: React.CSSProperties;
  };
}

const Node: React.FC<NodeProps> = ({ data }) => {
  const renderIcon = () => {
    switch (data.icon) {
      case "globe":
        return <CiGlobe />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        padding: ".25em",
        border: "2px solid #000",
        borderRadius: "8px",
        width: "auto",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        gap: ".5rem",
        ...data.style,
      }}
    >
      {renderIcon()}
      <strong>{data.label}</strong>
    </div>
  );
};

export default Node;
