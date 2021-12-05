import { render, RenderPosition } from './render';
import MenuView from './view/site-menu';
import UserLogoView  from './view/user-logo';
import NoFilmView from './view/no-film';
import SortView from './view/film-sort';
import FilmsContainerView from './view/film-container';
import FilmView from './view/film-card';
import LoadMoreButtonView  from './view/load-more-button';
import FilmPopupView from './view/film-popup';
import { generateFilm } from './mock/film';
import FilmStatisticiew from './view/film-stats';
import { filterFavoriteList, filterWatchedList, filterWatchList } from './mock/util';

const FILM_COUNT = 30;
const FILM_COUNT_PER_STEP = 5;

const films = Array.from({length: FILM_COUNT}, generateFilm);
const filterFavoriteFilm = filterFavoriteList(films);
const filterWatchedFilm = filterWatchedList(films);
const filterWatchFilm = filterWatchList(films);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const containerStatsElement = document.querySelector('.footer__statistics');

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmView(film);
  const FilmPopupComponent = new FilmPopupView(film);

  const addFilmPopup = () => document.body.appendChild(FilmPopupComponent.element);
  const removeFilmPopup = () => document.body.removeChild(FilmPopupComponent.element);

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      removeFilmPopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    addFilmPopup();
    document.addEventListener('keydown', onEscKeyDown);
  });

  FilmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
    removeFilmPopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(filmListElement, filmComponent.element, RenderPosition.BEFOREEND);
};
const filmsComponent = new FilmsContainerView();


if (films.length === 0) {
  render(siteMainElement, new NoFilmView().element, RenderPosition.BEFOREEND);
} else {
  render(siteMainElement, filmsComponent.element, RenderPosition.BEFOREEND);
  render(siteMainElement, new SortView().element, RenderPosition.AFTERBEGIN);
  render(siteHeaderElement, new UserLogoView().element, RenderPosition.BEFOREEND);
  for (let i = 0; i < FILM_COUNT_PER_STEP ; i++) {
    renderFilm(filmsComponent.element.querySelector('.films-list__container'), films[i]);
  }

  const LoadMoreButtonComponent = new LoadMoreButtonView();
  render(filmsComponent.element.querySelector('.films-list'), LoadMoreButtonComponent.element, RenderPosition.BEFOREEND);
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  LoadMoreButtonComponent.element.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderFilm(filmsComponent.element.querySelector('.films-list__container'), film));
    renderedFilmCount += FILM_COUNT_PER_STEP;
    if (renderedFilmCount >= films.length) {
      LoadMoreButtonComponent.element.remove();
      LoadMoreButtonComponent.removeElement();
    }
  });
}

render(siteMainElement, new MenuView(filterFavoriteFilm, filterWatchedFilm, filterWatchFilm).element, RenderPosition.AFTERBEGIN);
render(containerStatsElement, new FilmStatisticiew(FILM_COUNT).element, RenderPosition.BEFOREEND);
