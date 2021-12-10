import ParentView from './abstract-view.js';

const createNoFilmsTemplate = () => (
  `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
    </section>`
);

export default class NoFilmView extends ParentView {
  get template() {
    return createNoFilmsTemplate();
  }
}
