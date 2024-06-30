class SearchView {
  _parentElement = document.querySelector('.search'); // Parent element where search functionality is contained

  /**
   * Retrieves the current value entered in the search input field.
   * @returns {string} The value entered in the search input field.
   */
  getquery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  /**
   * Adds an event listener to the search form submission.
   * Prevents default form submission and invokes the provided handler function.
   * @param {function} handler The function to handle the search form submission.
   */
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView(); // Export instance of SearchView class
