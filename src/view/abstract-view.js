import { createElement } from '../render';

export default class ParentView {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === ParentView) {
      throw new Error('Can\'t instantiate ParentView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  removeElement() {
    this.#element = null;
  }
}
