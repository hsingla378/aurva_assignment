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
