import { render, RenderPosition } from './render';
import FilterView from './view/film-filter';
import UserLogoView  from './view/user-logo';
import MovieListPresenter from './presenter/movie-list-presenter';
import { generateFilm } from './mock/film';
import FilmStatisticiew from './view/film-stats';
import { filterFavoriteList, filterWatchedList, filterWatchList } from './mock/util';

const FILM_COUNT = 30;

const films = Array.from({length: FILM_COUNT}, generateFilm);

const filterFavoriteFilm = filterFavoriteList(films);
const filterWatchedFilm = filterWatchedList(films);
const filterWatchFilm = filterWatchList(films);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const containerStatsElement = document.querySelector('.footer__statistics');

const movieListPresenter = new MovieListPresenter(siteMainElement);

movieListPresenter.init(films);
render(siteHeaderElement, new UserLogoView(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filterFavoriteFilm, filterWatchedFilm, filterWatchFilm), RenderPosition.AFTERBEGIN);
render(containerStatsElement, new FilmStatisticiew(FILM_COUNT), RenderPosition.BEFOREEND);

