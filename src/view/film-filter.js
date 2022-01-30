import ParentView from './abstract-view.js';
import { MenuItem } from '../utils/constants.js';

const createFilterItem = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a href="#${name}"
  class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${type}" data-menu-type ="${MenuItem.FILMS}">${name}
  ${name !== 'All movies' ? `<span data-filter-type="${type}" class="main-navigation__item-count">
  ${count}</span>` : ''}
  </a>`;
};

const createFilterTemplate = (filterItems, currentFilterType, menuType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItem(filter, currentFilterType)).join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${menuType === MenuItem.STATISTICS ?'main-navigation__additional--active' : ''}" data-menu-type ="${MenuItem.STATISTICS}">Stats</a>
  </nav>`;
};


export default class FilterView extends ParentView {
  #filter = null;
  #currentFilter = null;
  #menuType = null;

  constructor(filter, currentFilterType, menuType) {
    super();
    this.#filter = filter;
    this.#currentFilter = currentFilterType;
    this.#menuType = menuType;
  }

  get template() {
    return createFilterTemplate(this.#filter, this.#currentFilter, this.#menuType);
  }

  setFilterTypeClickHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setMenuTypeClickHandler = (callback) => {
    this._callback.menuTypeChange = callback;
    this.element.addEventListener('click', this.#menuTypeChangeHandler);
  }

  #menuTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuTypeChange(evt.target.dataset.menuType);
  }

}
