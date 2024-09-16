import { CiGlobe } from "react-icons/ci";
import { IoFastFoodOutline } from "react-icons/io5";
import { PiShareFat } from "react-icons/pi";
import { BiDish, BiTag } from "react-icons/bi";
import { FaUtensils } from "react-icons/fa";

export const getNodeStyle = (type: string) => {
  switch (type) {
    case "explore":
      return {
        border: "1px solid #4caf50",
        backgroundColor: "#e8f5e9",
        boxShadow: "0px 8px 15px rgba(72, 187, 120, 0.2)",
        padding: "8px",
        icon: CiGlobe,
        iconColor: "#388e3c",
        hover: {
          borderColor: "#388e3c",
          backgroundColor: "#c8e6c9",
          transform: "scale(1.05)",
        },
      };
    case "category":
      return {
        border: "1px solid #ff9800",
        backgroundColor: "#fff3e0",
        boxShadow: "0px 8px 15px rgba(255, 152, 0, 0.2)",
        padding: "8px",
        icon: IoFastFoodOutline,
        iconColor: "#f57c00",
        hover: {
          borderColor: "#f57c00",
          backgroundColor: "#ffe0b2",
          transform: "scale(1.05)",
        },
      };
    case "viewMeals":
      return {
        border: "1px solid #3f51b5",
        backgroundColor: "#e8eaf6",
        boxShadow: "0px 8px 15px rgba(63, 81, 181, 0.2)",
        padding: "8px",
        icon: PiShareFat,
        iconColor: "#303f9f",
        hover: {
          borderColor: "#303f9f",
          backgroundColor: "#c5cae9",
          transform: "scale(1.05)",
        },
      };
    case "meal":
      return {
        border: "1px solid #673ab7",
        backgroundColor: "#ede7f6",
        boxShadow: "0px 8px 15px rgba(103, 58, 183, 0.2)",
        padding: "8px",
        icon: FaUtensils,
        iconColor: "#512da8",
        hover: {
          borderColor: "#512da8",
          backgroundColor: "#d1c4e9",
          transform: "scale(1.05)",
        },
      };
    case "ingredient":
      return {
        border: "1px solid #009688",
        backgroundColor: "#e0f2f1",
        boxShadow: "0px 8px 15px rgba(0, 150, 136, 0.2)",
        padding: "8px",
        icon: BiDish,
        iconColor: "#00796b",
        hover: {
          borderColor: "#00796b",
          backgroundColor: "#b2dfdb",
          transform: "scale(1.05)",
        },
      };
    case "tag":
      return {
        border: "1px solid #ff5722",
        backgroundColor: "#fbe9e7",
        boxShadow: "0px 8px 15px rgba(255, 87, 34, 0.2)",
        padding: "8px",
        icon: BiTag,
        iconColor: "#e64a19",
        hover: {
          borderColor: "#e64a19",
          backgroundColor: "#ffccbc",
          transform: "scale(1.05)",
        },
      };
    default:
      return {
        border: "1px solid #607d8b",
        backgroundColor: "#eceff1",
        boxShadow: "0px 8px 15px rgba(96, 125, 139, 0.2)",
        padding: "8px",
        icon: CiGlobe,
        iconColor: "#455a64",
        hover: {
          borderColor: "#455a64",
          backgroundColor: "#cfd8dc",
          transform: "scale(1.05)",
        },
      };
  }
};
