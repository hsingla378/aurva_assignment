# Food Explorer

## Objective

The **Food Explorer** is a graph-based food explorer app where users can visually explore different food categories, meals, and their details like ingredients, tags, and more. The app utilizes a node-based canvas interface for an intuitive and interactive experience.

## Features

- **Explore Categories:** A central "Explore" node displays an option to fetch and display meal categories.
- **View Meals:** Clicking on any category node reveals meals belonging to that category.
- **View Meal Details:** Selecting a meal displays details like ingredients, tags, instructions, and more.
- **Interactive UI:** Hover effects, expandable nodes, and draggable elements for enhanced user experience.
- **Closable Siblings:** When a new node is expanded, sibling nodes collapse to maintain clarity and avoid clutter.

## Technologies Used

- **React**: Core framework for building the user interface.
- **ReactFlow**: For handling graph-based node interactions and visualizations.
- **Tailwind CSS**: For efficient, utility-first styling.
- **Ant Design (Drawer)**: For displaying detailed meal information in a side panel.
- **React Hot Toast**: For handling toast notifications.
- **Vite**: Bundler and development server.

## Project Structure

```bash
├── public              # Static assets (HTML file, icons)
├── src
│   ├── components
│   │   ├── Header.tsx               # The header component with app title
│   │   ├── NodeGraph.tsx            # The main graph-based visualization of food categories and meals
│   │   ├── NodeComponent.tsx        # Component rendering individual nodes (categories, meals, etc.)
│   │   └── MealDetails.tsx          # Drawer component for displaying meal details
│   ├── utils
│   │   ├── api.ts                   # API methods for fetching categories, meals, and meal details
│   │   ├── constant.ts              # Styling for different node types (category, meal, ingredient, etc.)
│   │   └── types.ts                 # Type definitions for meal-related data
│   ├── App.tsx                      # Main application entry point
│   └── main.tsx                     # Vite's React entry point
└── index.html                       # Root HTML file

```

## API Reference

The app interacts with the **MealDB API** to fetch data. Below are the API endpoints used:

- **Categories:**  
  `https://www.themealdb.com/api/json/v1/1/categories.php`

- **Meals by Category:**  
  `https://www.themealdb.com/api/json/v1/1/filter.php?c=<category>`

- **Meal Details:**  
  `https://www.themealdb.com/api/json/v1/1/lookup.php?i=<mealId>`

- **Meals by Ingredient:**  
  `https://www.themealdb.com/api/json/v1/1/filter.php?i=<ingredient>`

## Key Components

- **Header:** Displays the app's name and tagline with a colorful gradient background.
- **NodeGraph:** The core visualization of food categories, meals, and their details using `ReactFlow`.
- **MealDetails:** A right-side drawer displaying detailed information about a selected meal.
- **NodeComponent:** A reusable component for rendering different types of nodes (category, meal, etc.) with specific styles.

## Custom Styling

All node types (e.g., categories, meals, ingredients) have unique colors and hover effects, ensuring a visually appealing interface. Styling is defined in `constant.ts` using utility classes from **Tailwind CSS**, and node-specific hover and icon styles are applied dynamically based on the node type.

## Future Improvements

- Add more filter options (e.g., filter by area or tag).
- Integrate user login and favorite meal saving feature.
- Provide search functionality for meals.

## Screenshots

![image](https://github.com/user-attachments/assets/22fe0216-93ee-43df-a43b-11ee60cc7dc4)

![image](https://github.com/user-attachments/assets/d436c031-3ebc-4135-8b42-ad8e015497b7)

![image](https://github.com/user-attachments/assets/b7324924-bfd1-42e4-8b7b-2b765ad88a1b)
