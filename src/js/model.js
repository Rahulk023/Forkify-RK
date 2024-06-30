import { async } from 'regenerator-runtime'; // Importing async
import { API_URL, PAGE_SIZE, KEY } from './config.js'; // Importing constants
import { AJAX, deleteRecipe } from './helper.js'; // Importing AJAX function

// State management for the application
export const state = {
  recipe: {}, // Holds current recipe details
  search: {
    query: '',
    page: 1,
    itemsPerPage: PAGE_SIZE,
    result: [],
    startPage: 1,
  },
  bookmark: [], // Holds bookmarked recipes
};

// Function to extract relevant recipe details from API response
const getRecipeInfo = function (response) {
  const { recipe } = response.data;
  return {
    id: recipe.id,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    image: recipe.image_url,
    ...(recipe.key && { key: recipe.key }), // Conditionally add key if present
  };
};

// Function to load a recipe by ID
export const loadRecipe = async function (id) {
  try {
    let response = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = getRecipeInfo(response);

    // Check if current recipe is bookmarked
    state.recipe.bookmarked = state.bookmark.some(
      bookmark => bookmark.id === id
    );
  } catch (error) {
    throw error;
  }
};

// Function to load search results based on query
export const loadSearchRecipes = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    const response = data.data.recipes;

    state.search.result = response.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      ...(recipe.key && { key: recipe.key }),
    }));

    state.search.page = 1; // Reset page number when new search is performed
  } catch (error) {
    throw error;
  }
};

// Function to paginate search results
export const modelPagination = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.itemsPerPage;
  const end = page * state.search.itemsPerPage;
  return state.search.result.slice(start, end);
};

// Function to update servings and adjust ingredient quantities
export const modelServing = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = roundToDecimal(
      (ing.quantity * newServings) / state.recipe.servings,
      2
    );
  });
  state.recipe.servings = newServings;
};

// Function to store bookmarks in localStorage
const endureBookmarks = function () {
  localStorage.setItem('storeRecipes', JSON.stringify(state.bookmark));
};

// Function to add a recipe to bookmarks
export const modelBookmarks = function (recipe) {
  state.bookmark.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  endureBookmarks();
};

// Function to remove a recipe from bookmarks
export const removeBookmark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  endureBookmarks();
};

// Function to initialize bookmarks from localStorage
const init = function () {
  const storage = localStorage.getItem('storeRecipes');
  if (storage) state.bookmark = JSON.parse(storage);
};

init(); // Initialize bookmarks on page load

// Function to clear all bookmarks from localStorage (for testing or clearing data)
const clearBookmarks = function () {
  localStorage.clear('storeRecipes');
};

// Function to upload a new recipe
export const modelUploading = async function (newRecipe) {
  try {
    let ingredients = [];
    for (let i = 1; newRecipe[`ingredient-description-${i}`]; i++) {
      ingredients.push({
        quantity: newRecipe[`ingredient-quantity-${i}`]
          ? +newRecipe[`ingredient-quantity-${i}`]
          : null,
        unit: newRecipe[`ingredient-unit-${i}`]
          ? newRecipe[`ingredient-unit-${i}`]
          : '',
        description: newRecipe[`ingredient-description-${i}`],
      });
    }

    // Prepare recipe object
    const recipeData = {
      title: newRecipe.title,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      servings: +newRecipe.servings,
      image_url: newRecipe.image,
    };

    // Upload recipe to API
    const uploadedResponse = await AJAX(`${API_URL}?key=${KEY}`, recipeData);

    // Update state with uploaded recipe info
    state.recipe = getRecipeInfo(uploadedResponse);
    modelBookmarks(state.recipe); // Add uploaded recipe to bookmarks
  } catch (err) {
    throw err;
  }
};

// Function to delete a recipe
export const deleteRecipeModel = async function (id) {
  try {
    const url = `${API_URL}/${id}?key=${KEY}`;

    // Remove the recipe from bookmarks if it exists
    removeBookmark(id);

    // Clear the current recipe details
    state.recipe = {};

    // Delete the recipe from the server
    await deleteRecipe(url);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Utility function to round numbers to a specified number of decimals
function roundToDecimal(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
