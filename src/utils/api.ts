// Get the top 5 categories
export const fetchMealCategories = async () => {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const data = await response.json();

    if (!data.categories) {
      console.warn("No categories found");
      return [];
    }

    return data.categories.slice(0, 5);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Get the top 5 meals from a specific category
export const fetchMealsByCategory = async (category: string) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const data = await response.json();

    if (!data.meals) {
      console.warn(`No meals found for category: ${category}`);
      return [];
    }

    return data.meals.slice(0, 5);
  } catch (error) {
    console.error("Error fetching meals:", error);
    return [];
  }
};

// Fetch meal details by meal ID
export const fetchMealDetails = async (mealId: string) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      console.warn(`No meal details found for meal ID: ${mealId}`);
      return null;
    }

    return data.meals[0];
  } catch (error) {
    console.error("Error fetching meal details:", error);
    return null;
  }
};
