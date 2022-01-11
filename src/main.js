import { render, RenderPosition } from './render';
import UserLogoView  from './view/user-logo';
import MovieListPresenter from './presenter/movie-list-presenter';
import { generateFilm } from './mock/film';
import FilmStatisticiew from './view/film-stats';
import { createUserStatsTemplate } from './view/user-statistic';
import FilmsModel from './model/movies-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const containerStatsElement = document.querySelector('.footer__statistics');
const FILM_COUNT = 30;

const films = Array.from({length: FILM_COUNT}, generateFilm);

const filmsModel = new FilmsModel();
filmsModel.films = films;
const filterModel = new FilterModel();

const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel, filterModel);

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(siteHeaderElement, new UserLogoView(), RenderPosition.BEFOREEND);

filterPresenter.init();
movieListPresenter.init();

render(containerStatsElement, new FilmStatisticiew(FILM_COUNT), RenderPosition.BEFOREEND);

createUserStatsTemplate();
