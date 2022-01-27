import { render, RenderPosition, remove} from './render';
import { MenuItem} from './mock/util';
import UserLogoView  from './view/user-logo';
import MovieListPresenter from './presenter/movie-list-presenter';
import FilmStatisticiew from './view/film-stats';
import FilmsModel from './model/movies-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';
import FilterPresenter from './presenter/filter-presenter';
import UserStatsView from './view/user-statistic';
import ApiService from './api-service';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const containerStatsElement = document.querySelector('.footer__statistics');

const AUTHORIZATION = 'Basic skvsjlsjYIGT67';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const filmsModel = new FilmsModel((new ApiService(END_POINT, AUTHORIZATION)));
const commentsModel = new CommentsModel((new ApiService(END_POINT, AUTHORIZATION)));
const filterModel = new FilterModel();

const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel, filterModel, commentsModel);

//переделать
render(siteHeaderElement, new UserLogoView(filmsModel.films), RenderPosition.BEFOREEND);

let userStatsElement = null;

const handleMenuClick = (menuType) => {
  const menuStats = document.querySelector('.main-navigation__additional');
  switch (menuType) {
    case MenuItem.FILMS:
      remove(userStatsElement);
      movieListPresenter.destroy();
      movieListPresenter.init();
      menuStats.classList.remove('main-navigation__additional--active');
      break;
    case MenuItem.STATISTICS:
      movieListPresenter.destroy();
      userStatsElement = new UserStatsView(filmsModel.films);
      render(siteMainElement, userStatsElement, RenderPosition.BEFOREEND);
      break;
  }
};
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel, handleMenuClick);

const renderFooterElement = () => {
  const films = filmsModel.films;
  render(containerStatsElement, new FilmStatisticiew(films.length), RenderPosition.BEFOREEND);
};

filterPresenter.init();
movieListPresenter.init();

filmsModel.init().finally(() => {
  renderFooterElement();
});

