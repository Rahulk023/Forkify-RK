import { View } from './view.js'; // Importing View class
import previewView from './previewView.js'; // Importing previewView module

class ResultView extends View {
  _parentElement = document.querySelector('.results'); // Parent element where results will be rendered
  _errorMessage = `We couldn't find any recipe. Please try again.`; // Error message when no recipe is found
  _successMessage = ''; // Placeholder for success message

  /**
   * Generates the HTML markup for displaying search results based on the provided data.
   * Uses the previewView to render each result as a preview.
   * @returns {string} HTML markup generated for displaying the search results.
   */
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView(); // Export instance of ResultView class
