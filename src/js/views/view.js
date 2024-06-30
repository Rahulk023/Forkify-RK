import icons from 'url:../../img/icons.svg'; // Importing SVG icons for dependency

export class View {
  _data; // Private property to store data for rendering

  /**
   * Renders markup based on provided data and inserts it into the DOM.
   * @param {Object|Array} data Data used to generate markup.
   * @param {boolean} render Determines if markup should be rendered or returned.
   * @returns {string|undefined} Rendered markup if render is false, otherwise undefined.
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError(); // Renders error message if data is empty or falsy
    }

    this._data = data; // Stores data in instance property
    const markUp = this._generateMarkup(); // Generates markup based on stored data

    if (!render) return markUp; // Returns markup if render is false

    this._clean(); // Clears parent element before inserting new markup
    this._parentElement.insertAdjacentHTML('afterbegin', markUp); // Inserts markup into parent element
  }

  /**
   * Updates the view with new data without re-rendering the entire view.
   * @param {Object|Array} data New data to update the view.
   */
  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return; // Skips update if data is empty or falsy
    }

    this._data = data; // Updates instance data with new data
    const newMarkup = this._generateMarkup(); // Generates new markup based on updated data

    // Creates a document fragment from the new markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Retrieves all elements from the new and current DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Iterates through new elements and updates corresponding current elements
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updates text content if it has changed
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updates attributes if they have changed
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  /**
   * Clears the content of the parent element.
   */
  _clean() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Displays a loader/spinner inside the parent element.
   */
  loaderFunction() {
    let loader = `<div class="spinner">
                    <svg>
                      <use href="${icons}#icon-loader"></use>
                    </svg>
                  </div>`;
    this._clean(); // Clears parent element content
    this._parentElement.insertAdjacentHTML('afterbegin', loader); // Inserts loader markup into parent element
  }

  /**
   * Renders an error message inside the parent element.
   * @param {string} message Custom error message to display.
   */
  renderError(message = this._errorMessage) {
    const markUp = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}!</p>
      </div>`;
    this._clean(); // Clears parent element content
    this._parentElement.insertAdjacentHTML('afterbegin', markUp); // Inserts error message markup into parent element
  }

  /**
   * Renders a success message inside the parent element.
   * @param {string} message Custom success message to display.
   */
  renderSuccess(message = this._successMessage) {
    const markUp = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clean(); // Clears parent element content
    this._parentElement.insertAdjacentHTML('afterbegin', markUp); // Inserts success message markup into parent element
  }

  /**
   * Abstract method to be implemented in child classes for generating markup.
   */
  _generateMarkup() {
    throw new Error('Method _generateMarkup() must be implemented');
  }
}
