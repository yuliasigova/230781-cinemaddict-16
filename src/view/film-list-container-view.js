import ParentView from './parent-view.js';

const createFilmsListContainerElement = () =>
  `<div class="films-list__container">
  </div>`;


export default class FilmsListContainerView extends ParentView {
  get template() {
    return createFilmsListContainerElement();
  }

}
