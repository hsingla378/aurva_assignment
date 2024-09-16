import { Drawer } from "antd";
import { MealDetail } from "../utils/types";

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
      width={400}
    >
      {mealDetails && (
        <div>
          <img
            src={mealDetails.strMealThumb}
            alt={mealDetails.strMeal}
            className="w-full mb-4"
          />

          <div className="flex items-center my-2 gap-2 flex-wrap">
            {mealDetails?.strTags?.split(",")?.map((strTag) => {
              return (
                <div className="rounded-lg border border-blue-300 text-blue-700 py-2 px-4">
                  {strTag}
                </div>
              );
            })}
          </div>
          <div className="w-full">
            {mealDetails?.strCategory && (
              <div className="grid grid-cols-2 w-full">
                <p>Category</p>
                <p>{mealDetails?.strCategory}</p>
              </div>
            )}
            {mealDetails?.strArea && (
              <div className="grid grid-cols-2">
                <p>Area</p> <p>{mealDetails?.strArea}</p>
              </div>
            )}
            {mealDetails?.strYoutube && (
              <div className="grid grid-cols-2">
                <p>YouTube</p>
                <a
                  href={mealDetails?.strYoutube}
                  target="_blank"
                  rel="noreferrer"
                >
                  {mealDetails?.strYoutube}
                </a>
              </div>
            )}
            {mealDetails?.strSource && (
              <div className="grid grid-cols-2">
                <p>Recipe</p>
                <p>{mealDetails?.strSource}</p>
              </div>
            )}
          </div>
          <div className="border border-black p-2 my-2">
            <p>
              <strong>Instructions</strong>{" "}
            </p>
            <p>{mealDetails?.strInstructions}</p>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default MealDetails;
