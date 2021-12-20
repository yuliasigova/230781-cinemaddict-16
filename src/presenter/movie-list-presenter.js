import { render, RenderPosition } from '../render';
import NoFilmView from '../view/no-film';
import SortView from '../view/film-sort';
import FilmsContainerView from '../view/film-container';
import FilmsListContainerView from '../view/film-list-container';
import LoadMoreButtonView  from '../view/load-more-button';
import MoviePresenter from './movie-presenter';
import { updateItem } from '../mock/util';

const FILM_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;

  #filmsComponent = new FilmsContainerView();
  #filmListComponent = new FilmsListContainerView();
  #sortComponent = new SortView();
  #emptyFilmComponent = new NoFilmView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #films = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #moviePresenter = new Map();

  constructor(mainContainer){
    this.#mainContainer = mainContainer;
  }

  init = (films) => {
    this.#films = [...films];
    if (this.#films.length === 0) {
      this.#renderEmptyFilms();
      return;
    }
    render(this.#mainContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent.element.querySelector('.films-list'), this.#filmListComponent, RenderPosition.BEFOREEND);
    this.#renderFilms(0, this.#renderedFilmCount);
    this.#renderLoadMoreButton();
  }

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#moviePresenter.get(updatedFilm.id).init(updatedFilm);
  }

  #renderFilm = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmListComponent, this.#handleFilmChange);
    moviePresenter.init(film);
    this.#moviePresenter.set(film.id, moviePresenter);
  }


  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  }

  #renderEmptyFilms = () => {
    render(this.#mainContainer, this.#emptyFilmComponent, RenderPosition.BEFOREEND);
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.#films.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  }

  #renderLoadMoreButton = () => {
    render(this.#filmListComponent, this.#loadMoreButtonComponent, RenderPosition.AFTEREND);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  }
}

