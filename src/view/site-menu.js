import ParentView from './abstract-view.js';

const createMenuTemplate = (watchlistCount, historyCount, favoriteCount) =>
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">
      ${watchlistCount.length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">
      ${historyCount.length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">
      ${favoriteCount.length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;

export default class MenuView extends ParentView {
    #watchlistCount = null;
    #historyCount = null;
    #favoriteCount = null;

    constructor(watchlistCount, historyCount, favoriteCount) {
      super();
      this.#watchlistCount = watchlistCount;
      this.#historyCount = historyCount;
      this.#favoriteCount = favoriteCount;
    }

    get template() {
      return createMenuTemplate(this.#watchlistCount, this.#historyCount, this.#favoriteCount);
    }
}
