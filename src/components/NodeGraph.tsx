import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  useReactFlow,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import Node from "./Node";
import {
  fetchMealCategories,
  fetchMealsByCategory,
  fetchMealDetails,
  fetchMealsByIngredient,
} from "../utils/api";
import { MealCategory } from "../utils/types";
import { Drawer } from "antd";
import "@xyflow/react/dist/style.css";
import toast from "react-hot-toast";

const initialNodes = [
  {
    id: "1",
    position: { x: 300, y: 50 },
    data: {
      label: "Explore",
    },
    type: "explore",
  },
];

const initialEdges: Edge[] = [];

function NodeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [exploreClicked, setExploreClicked] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mealDetails, setMealDetails] = useState(null);
  const [ingredientsMap, setIngredientsMap] = useState({});

  const { fitView } = useReactFlow();

  // Parent-Child relationships tracker
  const [parentChildMap, setParentChildMap] = useState<
    Record<string, string[]>
  >({});

  // Fetch categories and create new nodes and edges
  const handleExploreClick = useCallback(async () => {
    if (exploreClicked) return;
    setExploreClicked(true);

    const categories: MealCategory[] = await fetchMealCategories();

    // Generate category nodes with unique IDs
    const newNodes = categories.map((category, index) => ({
      id: `category-${category.strCategory}`,
      position: { x: 600, y: 50 + index * 120 },
      data: {
        label: category.strCategory,
      },
      type: "category", // Pass the "category" type
    }));

    // Generate edges that connect the "Explore" node to each category node
    const newEdges = categories.map((category) => ({
      id: `e1-category-${category.strCategory}`,
      source: "1",
      target: `category-${category.strCategory}`,
    }));

    // Add new nodes and preserve the "Explore" node
    setNodes((existingNodes) => [...existingNodes, ...newNodes]);

    // Add edges between Explore and categories
    setEdges((existingEdges) => [...existingEdges, ...newEdges]);

    // Adjust the graph to fit all the nodes
    setTimeout(() => {
      fitView({ padding: 0.1, duration: 500 });
    }, 200);
  }, [exploreClicked]);

  // Handle click on any node, including categories
  const handleNodeClick = useCallback(
    async (event, node) => {
      if (node.id === "1") {
        handleExploreClick();
      } else if (node.type === "category") {
        const viewMealsNodeId = `view-meals-${node.id}`;

        // Check if we have child nodes for this category in the parentChildMap
        if (parentChildMap[node.id]) {
          // Remove child nodes if they are already visible (collapse)
          const childNodes = parentChildMap[node.id];

          setNodes((existingNodes) =>
            existingNodes.filter((n) => !childNodes.includes(n.id))
          );

          setEdges((existingEdges) =>
            existingEdges.filter((e) => !childNodes.includes(e.target))
          );

          // Update the parent-child map to remove the entry
          const newMap = { ...parentChildMap };
          delete newMap[node.id];
          setParentChildMap(newMap);
        }

        // Add "View Meals" node (expand)
        const viewMealsNode = {
          id: viewMealsNodeId,
          position: { x: node.position.x + 300, y: node.position.y },
          data: {
            label: "View Meals",
            categoryName: node.data.label,
          },
          type: "viewMeals",
        };

        // Create an edge from the category to the "View Meals" node
        const viewMealsEdge = {
          id: `e-${node.id}-view-meals`,
          source: node.id,
          target: viewMealsNodeId,
        };

        // Add new node and edge
        setNodes((existingNodes) => [...existingNodes, viewMealsNode]);
        setEdges((existingEdges) => [...existingEdges, viewMealsEdge]);

        // Track the child node
        setParentChildMap((prevMap) => ({
          ...prevMap,
          [node.id]: [...(prevMap[node.id] || []), viewMealsNodeId],
        }));

        setTimeout(() => {
          fitView({ padding: 0.1, duration: 500 });
        }, 200);
      } else if (node.type === "viewMeals") {
        // Handle fetching and displaying meals on clicking "View Meals"
        const categoryName = node.data.categoryName;

        const meals = await fetchMealsByCategory(categoryName);

        if (!meals || meals.length === 0) {
          toast.error("No meals found for this category");
          return;
        }

        const mealNodes = meals.map((meal, index) => ({
          id: `meal-${meal.idMeal}`,
          position: {
            x: node.position.x + 300,
            y: node.position.y + index * 80,
          },
          data: {
            label: meal.strMeal,
          },
          type: "meal",
        }));

        // Create edges from "View Meals" to each meal node
        const mealEdges = meals.map((meal) => ({
          id: `e-${node.id}-meal-${meal.idMeal}`,
          source: node.id,
          target: `meal-${meal.idMeal}`,
        }));

        setNodes((existingNodes) => [...existingNodes, ...mealNodes]);
        setEdges((existingEdges) => [...existingEdges, ...mealEdges]);

        // Track the child meal nodes
        setParentChildMap((prevMap) => ({
          ...prevMap,
          [node.id]: [
            ...(prevMap[node.id] || []),
            ...mealNodes.map((meal) => meal.id),
          ],
        }));

        setTimeout(() => {
          fitView({ padding: 0.1, duration: 500 });
        }, 200);
      } else if (node.type === "meal") {
        // Handle clicking on a meal node and expanding it to show options
        const viewIngredientsNode = {
          id: `view-ingredients-${node.id}`,
          position: { x: node.position.x + 300, y: node.position.y - 60 },
          data: { label: "View Ingredients", mealId: node.id.split("-")[1] },
          type: "view",
        };

        const viewTagsNode = {
          id: `view-tags-${node.id}`,
          position: { x: node.position.x + 300, y: node.position.y },
          data: { label: "View Tags", mealId: node.id.split("-")[1] },
          type: "view",
        };

        const viewDetailsNode = {
          id: `view-details-${node.id}`,
          position: { x: node.position.x + 300, y: node.position.y + 60 },
          data: { label: "View Details", mealId: node.id.split("-")[1] },
          type: "view",
        };

        const viewNodes = [viewIngredientsNode, viewTagsNode, viewDetailsNode];
        const viewEdges = viewNodes.map((viewNode) => ({
          id: `e-${node.id}-${viewNode.id}`,
          source: node.id,
          target: viewNode.id,
        }));

        setNodes((existingNodes) => [...existingNodes, ...viewNodes]);
        setEdges((existingEdges) => [...existingEdges, ...viewEdges]);

        // Track the child nodes
        setParentChildMap((prevMap) => ({
          ...prevMap,
          [node.id]: [
            ...(prevMap[node.id] || []),
            viewIngredientsNode.id,
            viewTagsNode.id,
            viewDetailsNode.id,
          ],
        }));

        setTimeout(() => {
          fitView({ padding: 0.1, duration: 500 });
        }, 200);
      } else if (
        node.type === "view" &&
        node.data.label === "View Ingredients"
      ) {
        // Handle fetching ingredients and displaying them as child nodes
        const mealId = node.data.mealId;

        // Fetch the meal details if not already cached
        let mealDetails = ingredientsMap[mealId];
        if (!mealDetails) {
          mealDetails = await fetchMealDetails(mealId);
          setIngredientsMap((prevMap) => ({
            ...prevMap,
            [mealId]: mealDetails,
          }));
        }

        // Extract non-empty ingredients
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ingredient = mealDetails[`strIngredient${i}`];
          const measure = mealDetails[`strMeasure${i}`];
          if (ingredient && ingredient.trim()) {
            ingredients.push(`${ingredient}`);
          }
        }

        // Create ingredient nodes
        const ingredientNodes = ingredients.map((ingredient, index) => ({
          id: `ingredient-${mealId}-${index}`,
          position: {
            x: node.position.x + 300,
            y: node.position.y + index * 80,
          },
          data: { label: ingredient },
          type: "ingredient",
        }));

        const ingredientEdges = ingredientNodes.map((ingredientNode) => ({
          id: `e-${node.id}-${ingredientNode.id}`,
          source: node.id,
          target: ingredientNode.id,
        }));

        setNodes((existingNodes) => [...existingNodes, ...ingredientNodes]);
        setEdges((existingEdges) => [...existingEdges, ...ingredientEdges]);

        setTimeout(() => {
          fitView({ padding: 0.1, duration: 500 });
        }, 200);
      } else if (node.type === "ingredient") {
        // Handle clicking on an ingredient node and adding a "View Meals" node
        const viewMealsNode = {
          id: `view-meals-ingredient-${node.id}`,
          position: { x: node.position.x + 300, y: node.position.y },
          data: { label: "View Meals", ingredient: node.data.label },
          type: "viewMealsIngredient",
        };

        const viewMealsEdge = {
          id: `e-${node.id}-view-meals-ingredient-${node.id}`,
          source: node.id,
          target: viewMealsNode.id,
        };

        setNodes((existingNodes) => [...existingNodes, viewMealsNode]);
        setEdges((existingEdges) => [...existingEdges, viewMealsEdge]);

        setTimeout(() => {
          fitView({ padding: 0.1, duration: 500 });
        }, 200);
      } else if (node.type === "viewMealsIngredient") {
        // Handle fetching meals by ingredient and displaying them as child nodes
        const ingredient = node.data.ingredient;

        const meals = await fetchMealsByIngredient(ingredient);

        if (!meals || meals.length === 0) {
          toast.error(`No meals found for ingredient: ${ingredient}`);
          return;
        }

        const mealNodes = meals.map((meal, index) => ({
          id: `meal-${meal.idMeal}`,
          position: {
            x: node.position.x + 300,
            y: node.position.y + index * 80,
          },
          data: {
            label: meal.strMeal,
            style: {
              backgroundImage: `url(${meal.strMealThumb})`,
              backgroundSize: "cover",
            },
          },
          type: "meal",
        }));

        const mealEdges = mealNodes.map((mealNode) => ({
          id: `e-${node.id}-${mealNode.id}`,
          source: node.id,
          target: mealNode.id,
        }));

        setNodes((existingNodes) => [...existingNodes, ...mealNodes]);
        setEdges((existingEdges) => [...existingEdges, ...mealEdges]);

        setTimeout(() => {
          fitView({ padding: 0.1, duration: 500 });
        }, 200);
      } else if (node.type === "view" && node.data.label === "View Tags") {
        // Handle fetching tags and displaying them as child nodes
        const mealId = node.data.mealId;

        // Fetch the meal details if not already cached
        let mealDetails = ingredientsMap[mealId];
        if (!mealDetails) {
          mealDetails = await fetchMealDetails(mealId);
          setIngredientsMap((prevMap) => ({
            ...prevMap,
            [mealId]: mealDetails,
          }));
        }

        // Extract and split tags if they exist
        if (mealDetails?.strTags) {
          const tags = mealDetails.strTags.split(",");

          const tagNodes = tags.map((tag, index) => ({
            id: `tag-${mealId}-${index}`,
            position: {
              x: node.position.x + 300,
              y: node.position.y + index * 80,
            },
            data: { label: tag },
            type: "tag",
          }));

          const tagEdges = tagNodes.map((tagNode) => ({
            id: `e-${node.id}-${tagNode.id}`,
            source: node.id,
            target: tagNode.id,
          }));

          setNodes((existingNodes) => [...existingNodes, ...tagNodes]);
          setEdges((existingEdges) => [...existingEdges, ...tagEdges]);

          setTimeout(() => {
            fitView({ padding: 0.1, duration: 500 });
          }, 200);
        } else {
          toast.error("No tags found for this meal");
        }
      } else if (node.type === "view" && node.data.label === "View Details") {
        const mealId = node.data.mealId;
        const mealDetailsResponse = await fetchMealDetails(mealId);
        setMealDetails(mealDetailsResponse);
        setDrawerVisible(true);
      }
    },
    [nodes, parentChildMap, ingredientsMap]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [edges]
  );

  const nodeTypes = {
    explore: Node,
    category: Node,
    viewMeals: Node,
    viewMealsIngredient: Node,
    meal: Node,
    view: Node,
    ingredient: Node,
    tag: Node,
  };

  return (
    <div className="w-screen h-screen transition-all">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        onNodeClick={handleNodeClick}
      >
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
      </ReactFlow>

      {/* Drawer for showing meal details */}
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
    </div>
  );
}

export default NodeGraph;
