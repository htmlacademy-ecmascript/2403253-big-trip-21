import { createElement } from '../render.js';

function createListMarkup() {
  return '<ul class="trip-events__list"></ul>';
}

export default class ListView {
  getTemplate() {
    return createListMarkup();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
