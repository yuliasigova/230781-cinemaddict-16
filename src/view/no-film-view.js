import ParentView from './parent-view.js';
import { FilterType } from '../utils/constants.js';

const NoTasksTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
};

const createNoFilmsTemplate = (filterType) => {
  const noTaskTextValue = NoTasksTextType[filterType];

  return (
    `<section class="films">
    <section class="films-list">
    <h2 class="films-list__title">${noTaskTextValue}</h2>
    </section>
    </section>`);
};


export default class NoFilmView extends ParentView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoFilmsTemplate(this._data);
  }
}
