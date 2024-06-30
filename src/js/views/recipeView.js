import icons from 'url:../../img/icons.svg'; // Dependency for displaying icons
import Fraction from 'fraction.js'; // Importing Fraction from fractional module
import { View } from './view'; // Importing View class

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe'); // Parent element where recipe details will be rendered

  _errorMessage = `We couldn't find any recipe. Please try another search.`; // Error message for when no recipe is found
  _successMessage = '`Recipe deleted successfully. Search for new recipes.`'; // Success message placeholder

  /**
   * Adds event listeners for rendering the recipe details when the hash changes or the page loads.
   * @param {Function} handler Function to handle the rendering of recipe details.
   */
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => addEventListener(ev, handler));
  }

  /**
   * Adds event listener for adjusting servings when a servings button is clicked.
   * @param {Function} handler Function to handle the servings adjustment.
   */
  addHandlerServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // e.preventDefault();
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return;
      const servings = btn.dataset.servings;
      if (servings > 0) return handler(+servings);
    });
  }

  /**
   * Adds event listener for bookmarking/unbookmarking a recipe when the bookmark button is clicked.
   * @param {Function} handler Function to handle the bookmarking/unbookmarking action.
   */
  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // e.preventDefault();
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  addHandlerDeleteRecipe(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const deleteBtn = e.target.closest('.delete-btn');
      if (!deleteBtn) return;
      e.preventDefault(); // Prevent default only if a delete button is clicked
      const id = deleteBtn.getAttribute('href');
      handler(id);
    });
  }

  /**
   * Generates the HTML markup for displaying recipe details based on the provided data.
   * @returns {string} HTML markup generated for displaying the recipe details.
   */
  _generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>
          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings" data-servings="${
              this._data.servings - 1
            }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings" data-servings="${
              this._data.servings + 1
            }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <a href="${
          this._data.key ? this._data.id : ''
        }" class="recipe__user-generated__delete-btn delete-btn ${
      this._data.key ? '' : 'hidden'
    }">Delete</a>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>

        <button class="btn--round btn--bookmark">
          <svg>
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by 
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out 
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href=${this._data.sourceUrl}
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  _generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        ing.quantity ? new Fraction(Math.round(ing.quantity)).toString() : ''
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
    `;
  }
}

export default new RecipeView(); // Export instance of RecipeView class
