import { View } from './view.js';
import icons from 'url:../../img/icons.svg'; // Dependency for displaying icons

class previewView extends View {
  _parentElement = ''; // Parent element where the preview item will be rendered

  /**
   * Generates the HTML markup for a preview item based on the data provided.
   * @returns {string} HTML markup generated for the preview item.
   */
  _generateMarkup() {
    let id = window.location.hash.slice(1); // Get current hash ID from URL

    return ` 
      <li class="preview">
        <a class="preview__link ${
          this._data.id === id ? 'preview__link--active' : ''
        }" href="#${this._data.id}">
          <figure class="preview__fig">
            <img src="${this._data.image}" alt="${this._data.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}</p>
            <div class="preview__user-generated ${
              this._data.key ? '' : 'hidden'
            }">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default new previewView(); // Export instance of previewView class
