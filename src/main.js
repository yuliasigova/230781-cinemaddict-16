import { render, RenderPosition, remove } from './utils/render.js';
import { MenuItem } from './utils/constants.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import TotalFilmsView from './view/total-films-view.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import UserStatsView from './view/user-stats-view.js';
import ApiService from './service/api-service.js';

const siteMainElement = document.querySelector('.main');
const containerStatsElement = document.querySelector('.footer__statistics');

const AUTHORIZATION = 'Basic skvsjlsjYIGT67';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const filmsModel = new FilmsModel((new ApiService(END_POINT, AUTHORIZATION)));
const commentsModel = new CommentsModel((new ApiService(END_POINT, AUTHORIZATION)));
const filterModel = new FilterModel();

const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel, filterModel, commentsModel);

let userStatsElement = null;

const handleMenuClick = (menuType) => {
  const activeFilter = document.querySelector('.main-navigation__item--active');
  switch (menuType) {
    case MenuItem.FILMS:
      remove(userStatsElement);
      movieListPresenter.destroy();
      movieListPresenter.init();
      break;
    case MenuItem.STATISTICS:
      movieListPresenter.destroy();
      userStatsElement = new UserStatsView(filmsModel.films);
      render(siteMainElement, userStatsElement, RenderPosition.BEFOREEND);
      activeFilter.classList.remove('main-navigation__item--active');
      break;
  }
};

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel, handleMenuClick);

const renderFooterElement = () => {
  const films = filmsModel.films;
  render(containerStatsElement, new TotalFilmsView(films.length), RenderPosition.BEFOREEND);
};

filterPresenter.init();
movieListPresenter.init();

filmsModel.init().finally(() => {
  renderFooterElement();
});

