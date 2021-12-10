import AbstractView from './abstract-view.js';

const createFilmStatisticElement = (films) => `<p>${films} movies inside</p>`;

export default class FilmStatisticiew extends AbstractView {
  #films = null;

  constructor(films){
    super();
    this.#films = films;
  }

  get template() {
    return createFilmStatisticElement(this.#films);
  }

}
