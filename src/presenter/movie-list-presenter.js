import { remove, render, RenderPosition } from '../render';
import NoFilmView from '../view/no-film';
import SortView from '../view/film-sort';
import FilmsContainerView from '../view/film-container';
import FilmsListContainerView from '../view/film-list-container';
import LoadMoreButtonView  from '../view/load-more-button';
import MoviePresenter from './movie-presenter';
import { SortType, sortFilmsDate, sortFilmsRating, UpdateType, UserAction, filter} from '../mock/util';

const FILM_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;
  #filmsModel = null;
  #filterModel = null;

  #filmsComponent = new FilmsContainerView();
  #filmListComponent = new FilmsListContainerView();
  #emptyFilmComponent = new NoFilmView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sortComponent = null;

  constructor(mainContainer, filmsModel, filterModel){
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films () {
    const filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[filterType](films);
    switch (this.#currentSortType) {
      case SortType.DATE:
        return sortFilmsDate(filteredFilms);
      case SortType.RATING:
        return sortFilmsRating(filteredFilms);
    }
    return filteredFilms;
  }

  init = () => {
    if (this.films.length === 0) {
      this.#renderEmptyFilms();
      return;
    }
    this.#renderBoard();
  }

  #renderFilm = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmListComponent,this.#handleViewAction);
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
      remove(this.#loadMoreButtonComponent);
    }
  }

  #renderLoadMoreButton = () => {
    render(this.#filmListComponent, this.#loadMoreButtonComponent, RenderPosition.AFTEREND);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  }

  #renderBoard = () => {
    this.#renderSort();
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent.element.querySelector('.films-list'), this.#filmListComponent, RenderPosition.BEFOREEND);
    this.#renderFilms(0,  this.#renderedFilmCount);
    this.#renderLoadMoreButton();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearTaskList();
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#mainContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #clearTaskList = () => {
    this.#moviePresenter.forEach((movie) => movie.destroy());
    this.#moviePresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#sortComponent);
    remove(this.#loadMoreButtonComponent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTaskList();
        this.#renderBoard();
        break;
    }
  }
}
