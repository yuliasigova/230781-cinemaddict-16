import ParentView from './abstract-view.js';

const createFilmsContainerElement = () =>
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container">
    </section>
  </section>`;

export default class FilmsContainerView extends ParentView {
  get template() {
    return createFilmsContainerElement();
  }

}
