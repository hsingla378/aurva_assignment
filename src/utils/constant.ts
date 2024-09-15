import { CiGlobe } from "react-icons/ci";
import { IoFastFoodOutline } from "react-icons/io5";

export const getNodeStyle = (type: string) => {
  switch (type) {
    case "explore":
      return {
        border: "1px solid #f0f0f0",
        backgroundColor: "#f0f8ff",
        boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
        icon: CiGlobe,
      };
    case "category":
      return {
        border: "1px solid #f0f0f0",
        backgroundColor: "#ffffff",
        boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
        icon: IoFastFoodOutline,
      };
    default:
      return {
        border: "1px solid #f0f0f0",
        backgroundColor: "#ffffff",
        boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
        icon: CiGlobe,
      };
  }
};
