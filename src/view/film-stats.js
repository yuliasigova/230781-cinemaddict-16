import ParentView from './abstract-view.js';

const createFilmStatisticElement = (films) => `<p>${films} movies inside</p>`;

export default class FilmStatisticiew extends ParentView {
  #films = null;

  constructor(films){
    super();
    this.#films = films;
  }

  get template() {
    return createFilmStatisticElement(this.#films);
  }

}
