import { View } from './view.js';
import previewView from './previewView.js';

class bookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list'); // Parent element where bookmarks will be rendered
  _errorMessage = `There are no recipes bookmarked.`; // Error message for empty bookmark list
  _successMessage = ''; // Success message placeholder

  /**
   * Adds event handler to trigger when bookmarks are loaded.
   * @param {function} handler Function to handle bookmark loading.
   */
  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler); // Listen for page load event to trigger handler
  }

  /**
   * Generates the HTML markup for displaying bookmarks.
   * @returns {string} HTML markup generated from bookmark data.
   */
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false)) // Render each bookmark using previewView
      .join(''); // Join all markup strings into a single string
  }
}

export default new bookmarkView(); // Export instance of bookmarkView class
