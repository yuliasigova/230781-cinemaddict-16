import ParentView from './parent-view.js';

const createLoadingTemplate = () => `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">Loading...</h2>
  </section>
</section>`;

export default class LoadingView extends ParentView {
  get template() {
    return createLoadingTemplate();
  }
}
