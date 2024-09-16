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
import { fetchMealCategories, fetchMealsByCategory } from "../utils/api";
import { MealCategory } from "../utils/types";

import "@xyflow/react/dist/style.css";

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
          console.warn(`No meals found for category: ${categoryName}`);
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
          data: { label: "View Ingredients" },
          type: "view",
        };

        const viewTagsNode = {
          id: `view-tags-${node.id}`,
          position: { x: node.position.x + 300, y: node.position.y },
          data: { label: "View Tags" },
          type: "view",
        };

        const viewDetailsNode = {
          id: `view-details-${node.id}`,
          position: { x: node.position.x + 300, y: node.position.y + 60 },
          data: { label: "View Details" },
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
      }
    },
    [nodes, parentChildMap]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [edges]
  );

  const nodeTypes = {
    explore: Node,
    category: Node,
    viewMeals: Node,
    meal: Node,
    view: Node,
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
    </div>
  );
}

export default NodeGraph;
