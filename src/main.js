import { render, RenderPosition } from './render';
import UserLogoView  from './view/user-logo';
import MovieListPresenter from './presenter/movie-list-presenter';
import FilmStatisticiew from './view/film-stats';
import { createUserStatsTemplate } from './view/user-statistic';
import FilmsModel from './model/movies-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';
import FilterPresenter from './presenter/filter-presenter';
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
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(siteHeaderElement, new UserLogoView(), RenderPosition.BEFOREEND);


const renderFooterElement = () => {
  const films = filmsModel.films;
  render(containerStatsElement, new FilmStatisticiew(films.length), RenderPosition.BEFOREEND);
};

filterPresenter.init();
movieListPresenter.init();


createUserStatsTemplate();
filmsModel.init().finally(() => {
  renderFooterElement();
});

