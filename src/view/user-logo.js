import ParentView from './abstract-view.js';
import { getUserRank } from '../utils/stats.js';

const createUserLogoTemplate = (films) =>
  `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(films)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;

export default class UserLogoView extends ParentView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createUserLogoTemplate(this.#films);
  }

}

