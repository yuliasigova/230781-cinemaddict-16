import { render, RenderPosition } from '../render';
import NoFilmView from '../view/no-film';
import SortView from '../view/film-sort';
import FilmsContainerView from '../view/film-container';
import FilmsListContainerView from '../view/film-list-container';
import LoadMoreButtonView  from '../view/load-more-button';
import MoviePresenter from './movie-presenter';
import { SortType, sortFilmsDate, sortFilmsRating } from '../mock/util';

const FILM_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;
  #filmsModel = null;

  #filmsComponent = new FilmsContainerView();
  #filmListComponent = new FilmsListContainerView();
  #sortComponent = new SortView();
  #emptyFilmComponent = new NoFilmView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(mainContainer, filmsModel){
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
  }

  get films () {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return sortFilmsDate(this.#filmsModel.films);
      case SortType.RATING:
        return sortFilmsRating(this.#filmsModel.films);
    }
    return this.#filmsModel.films;
  }

  init = () => {
    if (this.films.length === 0) {
      this.#renderBoard();
      return;
    }
    this.#renderSort();
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent.element.querySelector('.films-list'), this.#filmListComponent, RenderPosition.BEFOREEND);
    this.#renderFilms(0,  this.#renderedFilmCount);
    this.#renderLoadMoreButton();
  }

  #handleFilmChange = (updatedFilm) => {
    this.#moviePresenter.get(updatedFilm.id).init(updatedFilm);
  }

  #renderFilm = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmListComponent, this.#handleFilmChange);
    moviePresenter.init(film);
    this.#moviePresenter.set(film.id, moviePresenter);
  }


  #renderFilms = (from, to) => {
    this.films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  }

  #renderEmptyFilms = () => {
    render(this.#mainContainer, this.#emptyFilmComponent, RenderPosition.BEFOREEND);
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.films.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  }

  #renderLoadMoreButton = () => {
    render(this.#filmListComponent, this.#loadMoreButtonComponent, RenderPosition.AFTEREND);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  }

  #renderBoard = () => {
    this.#renderEmptyFilms();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearTaskList();
    this.#renderFilms(0,  this.#renderedFilmCount);
    this.#renderLoadMoreButton();
  }

  #renderSort = () => {
    render(this.#mainContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #clearTaskList = () => {
    this.#moviePresenter.forEach((movie) => movie.destroy());
    this.#moviePresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    this.#loadMoreButtonComponent.element.remove();
    this.#loadMoreButtonComponent.removeElement();
  }

}

