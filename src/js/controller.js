// Import polyfills and configuration
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

// Importing modules
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

// Hot module replacement
if (module.hot) {
  module.hot.accept();
}

// Function to fetch recipe details
const getRecipeDetails = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Show loader while fetching recipe
    recipeView.loaderFunction();

    // Update result view to mark selected search result
    resultView.update(model.modelPagination());
    bookmarkView.update(model.state.bookmark);

    // Load recipe data
    await model.loadRecipe(id);

    // Render recipe data
    recipeView.render(model.state.recipe);
  } catch (error) {
    // Render error if fetching fails
    recipeView.renderError();
  }
};

// Function to handle search results
const searchResults = async function () {
  try {
    // Show loader while fetching search results
    resultView.loaderFunction();

    // Get search query
    const query = searchView.getquery();
    if (!query) return;

    // Load search recipes
    await model.loadSearchRecipes(query);

    // Render search results
    resultView.render(model.modelPagination());

    // Render pagination
    paginationView.render(model.state.search);
  } catch (error) {
    // Render error if search fails
    resultView.renderError(error);
  }
};

// Function to handle pagination
const controlPagination = function (goToPage) {
  // Render recipes for selected page
  resultView.render(model.modelPagination(goToPage));

  // Render pagination
  paginationView.render(model.state.search);
};

// Function to handle servings change
const controlServings = function (serving) {
  // Update servings in model
  model.modelServing(serving);

  // Update view with new servings
  recipeView.update(model.state.recipe);
};

// Function to handle bookmarking
const bookmarkController = function () {
  if (!model.state.recipe.bookmarked) {
    model.modelBookmarks(model.state.recipe); // Add bookmark
  } else {
    model.removeBookmark(model.state.recipe.id); // Remove bookmark
  }

  // Update view with bookmark status
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarkView.render(model.state.bookmark);
};

// Function to render bookmarks
const renderBookmarks = function () {
  bookmarkView.render(model.state.bookmark);
};

// Function to handle adding/updating recipes
const addRecipe = async function (data) {
  try {
    // Show loader while uploading recipe
    addRecipeView.loaderFunction();

    // Upload recipe data
    await model.modelUploading(data);

    // Render uploaded recipe
    recipeView.render(model.state.recipe);

    // Render success message
    addRecipeView.renderSuccess();

    // Update bookmarks view
    bookmarkView.render(model.state.bookmark);

    // Update URL without reloading
    window.history.pushState('', '', `#${model.state.recipe.id}`);

    // Close modal after a delay and re-render the form
    setTimeout(function () {
      addRecipeView.toggle();
      addRecipeView.renderForm();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    // Render error if upload fails
    addRecipeView.renderError(error.message);
  }
};

// Function to handle deleting recipes
const controlDeleteRecipe = async function (id) {
  try {
    recipeView.loaderFunction(); // Display loader or indication

    // Delete recipe and await completion
    await model.deleteRecipeModel(id);

    // Render updated bookmarks
    bookmarkView.render(model.state.bookmark);

    // Display success message
    recipeView.renderSuccess();

    // Remove the hash from the URL without refreshing the page
    window.history.replaceState(null, '', '/');
  } catch (err) {
    // Handle errors
    console.error('Error deleting recipe:', err);
    recipeView.renderError(err);
  }
};

// Initialize application
const init = function () {
  // Event listeners for various views
  bookmarkView.addHandlerBookmarks(renderBookmarks);
  recipeView.addHandlerRender(getRecipeDetails);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(bookmarkController);
  recipeView.addHandlerDeleteRecipe(controlDeleteRecipe);
  searchView.addHandlerSearch(searchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(addRecipe);
};

// Initialize application on load
init();
