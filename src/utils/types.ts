export interface MealCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetail {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string;
  strYoutube: string;
  strSource: string;
  [key: string]: string | null;
}

export interface MealNode {
  id: string;
  data: MealCategory | Meal | MealDetail;
  position: {
    x: number;
    y: number;
  };
  type: string;
}

