import { Drawer } from "antd";
import { MealDetail } from "../utils/types";
import React from "react";

interface MealDetailsProps {
  mealDetails: MealDetail | null;
  drawerVisible: boolean;
  setDrawerVisible: (value: boolean) => void;
}

const MealDetails: React.FC<MealDetailsProps> = ({
  mealDetails,
  drawerVisible,
  setDrawerVisible,
}) => {
  return (
    <Drawer
      title={mealDetails?.strMeal}
      placement="right"
      onClose={() => setDrawerVisible(false)}
      open={drawerVisible}
      width={420}
      bodyStyle={{
        padding: "16px",
        backgroundColor: "#fafafa",
      }}
      headerStyle={{
        backgroundColor: "#4caf50",
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {mealDetails && (
        <div>
          <img
            src={mealDetails.strMealThumb}
            alt={mealDetails.strMeal}
            className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg"
          />

          <div className="flex items-center my-2 gap-2 flex-wrap">
            {mealDetails?.strTags?.split(",").map((strTag, idx) => (
              <div
                key={idx}
                className="rounded-full bg-blue-100 text-blue-600 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-blue-200"
              >
                #{strTag.trim()}
              </div>
            ))}
          </div>

          <div className="grid gap-4 my-4">
            {mealDetails?.strCategory && (
              <div className="grid grid-cols-2">
                <span className="font-semibold">Category:</span>
                <span>{mealDetails?.strCategory}</span>
              </div>
            )}

            {mealDetails?.strArea && (
              <div className="grid grid-cols-2">
                <span className="font-semibold">Area:</span>
                <span>{mealDetails?.strArea}</span>
              </div>
            )}

            {mealDetails?.strYoutube && (
              <div className="grid grid-cols-2">
                <span className="font-semibold">YouTube:</span>
                <a
                  href={mealDetails?.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Watch Video
                </a>
              </div>
            )}

            {mealDetails?.strSource && (
              <div className="grid grid-cols-2">
                <span className="font-semibold">Recipe Source:</span>
                <a
                  href={mealDetails?.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Source
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-gray-300 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <p className="text-gray-700 leading-relaxed">
              {mealDetails?.strInstructions}
            </p>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default MealDetails;
