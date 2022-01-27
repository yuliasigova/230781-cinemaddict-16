import FilterView from '../view/film-filter.js';
import { remove, render, RenderPosition } from '../render.js';
import {filter, FilterType, UpdateType} from '../mock/util.js';


export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;
  #changeBoard = null;
  #menuType = null;

  constructor(filterContainer, filterModel, filmsModel, changeBoard) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#changeBoard = changeBoard;
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView(filters, this.#filterModel.filter, this.#menuType);
    this.#filterComponent.setFilterTypeClickHandler(this.#handleFilterTypeChange);
    this.#filterComponent.setMenuTypeClickHandler(this.#handleMenuTypeClick);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    this.#filterContainer.replaceChild(this.#filterComponent.element, prevFilterComponent.element);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MINOR, filterType);
  }

  #handleMenuTypeClick = (menuType) => {
    if (this.#menuType !== menuType) {
      this.#menuType = menuType;
      this.#changeBoard(menuType);
    }
  }
}
