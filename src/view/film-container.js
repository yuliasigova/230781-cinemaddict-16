import { createElement } from '../render';

const createFilmsContainerElement = () =>
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container">
    </section>
  </section>`;

export default class FilmsContainerView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsContainerElement();
  }

  removeElement() {
    this.#element = null;
  }
}
