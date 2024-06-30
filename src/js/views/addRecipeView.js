import { View } from './view.js';
import icons from 'url:../../img/icons.svg'; // Importing SVG icons for dependency

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload'); // Parent element where form resides
  _errorMessage = `We couldn't find any recipe. Please try another search.`; // Error message for unsuccessful operations
  _successMessage = 'New recipe added successfully'; // Success message for successful operations
  _windows = document.querySelector('.add-recipe-window'); // Recipe window element
  _overlay = document.querySelector('.overlay'); // Overlay element for modal

  _btnOpen = document.querySelector('.nav__btn--add-recipe'); // Button to open the modal
  _btnClose = document.querySelector('.btn--close-modal'); // Button to close the modal
  fieldValue = 1;
  _recipeParent = document.getElementById(
    'upload__column--ingredients-section'
  );
  _diat = document.getElementById('upload__ingredient');
  plusBtn = document.getElementById('plus-btn');
  minusBtn = document.getElementById('minus-btn');
  // minusBtn = document.querySelector('.ingredient__btn--minus');
  _creatingFiled(type = true) {
    if (type) {
      const fieldMarkUp = this.renderRecipeIngredients();
      this._recipeParent.insertAdjacentHTML('beforeEnd', fieldMarkUp);
    } else {
      if (this.fieldValue === 1) return; // Prevent removing the first field
      const className = document.querySelector(
        `.ingredientfield-${this.fieldValue}`
      );
      className.remove();
      this.fieldValue--;
    }
  }

  renderForm() {
    const htmlMarkUp = this.renderParentElIngreident();
    this._clean(); // Clears parent element content
    this._parentElement.insertAdjacentHTML('afterbegin', htmlMarkUp);
    this._recipeParent = document.getElementById(
      'upload__column--ingredients-section'
    );
    this.fieldValue = 1; // Reset the field value
  }

  /**
   * Constructor to initialize the view and setup event handlers.
   * Inherits from View class.
   */
  constructor() {
    super(); // Call parent constructor
    this.addHandlerShowWindow(); // Attach event handler to open modal
    this.addHandlerCloseWindow(); // Attach event handler to close modal
  }

  /**
   * Toggles the visibility of the modal window and overlay.
   */
  toggle() {
    this._overlay.classList.toggle('hidden'); // Toggle overlay visibility
    this._windows.classList.toggle('hidden'); // Toggle modal window visibility
  }

  /**
   * Adds event listener to open the modal window.
   */
  addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggle.bind(this)); // Open modal on button click
  }

  /**
   * Adds event listener to close the modal window and overlay.
   */
  addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggle.bind(this)); // Close modal on button click
    this._overlay.addEventListener('click', this.toggle.bind(this)); // Close modal on overlay click
  }

  /**
   * Adds event listener to handle form submission for uploading a new recipe.
   * @param {function} handler Function to handle form submission with form data.
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const isValid = this.validateForm();

      if (isValid) {
        if (e.submitter.id === this.plusBtn.id) {
          this.fieldValue++;
          this._creatingFiled(true); // Explicitly pass true to indicate adding a field
        } else if (e.submitter.id === this.minusBtn.id) {
          this._creatingFiled(false); // Explicitly pass false to indicate removing a field
        } else {
          const formData = this.getFormData();
          handler(formData);
        }
      } else {
        alert('Form is not valid. Please check the fields.'); // Display error message for invalid form
      }
    });
  }

  /**
   * Validates form fields for required input, URL format, and numerical values.
   * @returns {boolean} true if form is valid, false otherwise.
   */
  validateForm() {
    const inputs = this._parentElement.querySelectorAll('input'); // Select all input fields
    let isValid = true; // Assume form is valid initially

    inputs.forEach(input => {
      input.classList.remove('invalid'); // Remove previous validation styles

      if (input.hasAttribute('required') && !input.value.trim()) {
        // Check for required fields
        isValid = false; // Mark form as invalid
        input.classList.add('invalid'); // Add validation style for invalid input
      } else if (input.type === 'url' && !this.isValidUrl(input.value)) {
        // Validate URL format
        isValid = false; // Mark form as invalid
        input.classList.add('invalid'); // Add validation style for invalid URL
      } else if (
        (input.type === 'number' ||
          input.name === 'cookingTime' ||
          input.name === 'servings') &&
        isNaN(input.value)
      ) {
        // Validate numerical input fields
        isValid = false; // Mark form as invalid
        input.classList.add('invalid'); // Add validation style for non-numeric input
      }
    });

    return isValid; // Return validation result
  }

  clearForm() {
    this._parentElement.reset();
    this.fieldValue = 1;
    // Optionally, you can also reset any dynamically added fields to the initial state if needed
    this._recipeParent.innerHTML = this.renderRecipeIngredients();
  }

  /**
   * Retrieves form data as an object.
   * @returns {Object} Form data object.
   */
  getFormData() {
    const formData = new FormData(this._parentElement); // Create FormData object from form

    return Object.fromEntries(formData); // Convert FormData to plain object
  }

  /**
   * Checks if a given string is a valid URL.
   * @param {string} url URL string to validate.
   * @returns {boolean} true if URL is valid, false otherwise.
   */
  isValidUrl(url) {
    try {
      new URL(url); // Attempt to create URL object
      return true; // URL is valid
    } catch (error) {
      return false; // URL is invalid
    }
  }

  renderParentElIngreident() {
    return ` <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="" required name="title" type="text" />
          <label>URL</label>
          <input value="" required name="sourceUrl" type="url" />
          <label>Image URL</label>
          <input value="" required name="image" type="url" />
          <label>Publisher</label>
          <input value="" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="" required name="servings" type="number" />
        </div>

        <div class="upload__column upload__column--ingredients">
          <h3 class="upload__heading">Ingredients</h3>
          <div class="upload__column--ingredients-section" id="upload__column--ingredients-section">
            <div class="upload__ingredient" id="upload__ingredient">
              <div class="upload__label">
                <label>Ingredient 1</label>
              </div>
              <div class="upload__inputs">
                <input
                  value=""
                  type="number"
                  min="0"
                  name="ingredient-quantity-1"
                  placeholder="Quantity"
                  style="padding-right: 2px; padding-left: 6px"
                />
                <input
                  value=""
                  type="text"
                  name="ingredient-unit-1"
                  placeholder="Unit"
                />
                <input
                  value=""
                  type="text"
                  required
                  name="ingredient-description-1"
                  placeholder="Description"
                />
              </div>
            </div>
          </div>
           <div class="upload__ingredient-buttons">
            <button id="plus-btn" class="ingredient__btn ingredient__btn--plus">
              <span>+</span>
            </button>
            <button
              id="minus-btn"
              class="ingredient__btn ingredient__btn--minus"
            >
              <span>-</span>
            </button>
          </div>
        </div>

        <button type="submit" class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>`;
  }

  //render the add recipe igredients filed means dynamically creating
  renderRecipeIngredients() {
    return ` <div class="upload__ingredient ingredientfield-${this.fieldValue}" id="ingredientfield-${this.fieldValue}">
              <div class="upload__label">
                <label>Ingredient ${this.fieldValue}</label>
              </div>
              <div class="upload__inputs">
                <input
                  value=""
                  type="number"
                  name="ingredient-quantity-${this.fieldValue}"
                  placeholder="Quantity"
                 style=" padding-right: 2px; padding-left: 6px;"
                 />
                <input
                  value=""
                  type="text"
                  name="ingredient-unit-${this.fieldValue}"
                  placeholder="Unit"
                />
                <input
                  value=""
                  type="text"
                  required
                  name="ingredient-description-${this.fieldValue}"
                  placeholder="Description"
                />
              </div>
            </div>`;
  }
}

export default new addRecipeView(); // Export instance of addRecipeView class

/**clearForm() {
  this._parentElement.reset();
  this.fieldValue = 1;
  // Optionally, you can also reset any dynamically added fields to the initial state if needed
  this._recipeParent.innerHTML = this.renderRecipeIngredients();
}
 */
