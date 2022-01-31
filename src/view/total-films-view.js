import ParentView from './parent-view.js';

const createTotalFilmsElement = (films) => `<p>${films} movies inside</p>`;

export default class TotalFilmsView extends ParentView {
  #films = null;

  constructor(films){
    super();
    this.#films = films;
  }

  get template() {
    return createTotalFilmsElement(this.#films);
  }

}
