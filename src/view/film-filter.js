import ParentView from './abstract-view.js';

const createFilterItem = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a href="#${name}"
  class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">${name}
  ${name !== 'All movies' ? `<span class="main-navigation__item-count">
  ${count}</span>` : ''}
  </a>`;
};
const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItem(filter, currentFilterType)).join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};


export default class FilterView extends ParentView {
  #filter = null;
  #currentFilter = null;

  constructor(filter, currentFilterType) {
    super();
    this.#filter = filter;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filter, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

}
