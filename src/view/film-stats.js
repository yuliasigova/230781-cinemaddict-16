import { createElement } from '../render';

const createFilmStatisticElement = (films) => `<p>${films} movies inside</p>`;

export default class FilmStatisticiew {
  #element = null;
  #films = null;

  constructor(films){
    this.#films = films;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmStatisticElement(this.#films);
  }

  removeElement() {
    this.#element = null;
  }
}
