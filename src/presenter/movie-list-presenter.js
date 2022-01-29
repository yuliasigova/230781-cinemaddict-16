import { remove, render, RenderPosition } from '../render';
import NoFilmView from '../view/no-film';
import SortView from '../view/film-sort';
import FilmsContainerView from '../view/film-container';
import FilmsListContainerView from '../view/film-list-container';
import LoadMoreButtonView  from '../view/load-more-button';
import MoviePresenter from './movie-presenter';
import UserLogoView  from '../view/user-logo';
import { SortType, sortFilmsDate, sortFilmsRating, UpdateType, UserAction, filter, FilterType, State} from '../mock/util';
import PopupPresenter from './popup-presenter';
import LoadingView from '../view/loading-view';
const FILM_COUNT_PER_STEP = 5;


export default class MovieListPresenter {
  #mainContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #filmsComponent = new FilmsContainerView();
  #filmListComponent = new FilmsListContainerView();
  #emptyFilmComponent = null;
  #loadMoreButtonComponent = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sortComponent = null;
  #filterType = FilterType.ALL
  #popupPresenter = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #userProfile = null;

  constructor(mainContainer, filmsModel, filterModel, commentsModel){
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
    this.#popupPresenter = new PopupPresenter(document.body, this.#handleViewAction, this.#commentsModel);
  }

  get films () {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);
    switch (this.#currentSortType) {
      case SortType.DATE:
        return sortFilmsDate(filteredFilms);
      case SortType.RATING:
        return sortFilmsRating(filteredFilms);
    }
    return filteredFilms;

  }

  init = () => {
    this.#filmsModel.addObserver(this.handleModelEvent);
    this.#filterModel.addObserver(this.handleModelEvent);
    this.#commentsModel.addObserver(this.handleModelEvent);
    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({resetSortType: true, resetRenderedFilmCount: true});

    this.#filmsModel.removeObserver(this.handleModelEvent);
    this.#filterModel.removeObserver(this.handleModelEvent);
    this.#commentsModel.removeObserver(this.handleModelEvent);
  }

  #renderFilm = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmListComponent, this.#handleViewAction);
    moviePresenter.init(film);
    this.initPopup = () => this.#popupPresenter.init(film);
    moviePresenter.setFilmPopup(this.initPopup);
    this.#moviePresenter.set(film.id, moviePresenter);
  }

  #renderFilms = (from, to) => {
    this.films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  }

  #renderLoading = () => {
    render(this.#mainContainer, this.#loadingComponent, RenderPosition.BEFOREEND);
  }

  #renderEmptyFilms = () => {
    this.#emptyFilmComponent = new NoFilmView(this.#filterType);
    render(this.#mainContainer, this.#emptyFilmComponent, RenderPosition.BEFOREEND);
  }

  #renderUserProfile = () => {
    const siteHeaderElement = document.querySelector('.header');
    const films = this.#filmsModel.films;
    const watchedFilms = films.filter((film) => film.isWatched);
    remove(this.#userProfile);
    if (watchedFilms.length > 0) {
      this.#userProfile = new UserLogoView(films);
      render(siteHeaderElement, this.#userProfile, RenderPosition.BEFOREEND);
    }
  }

  #handleLoadMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderFilms(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderedFilmCount = newRenderedFilmCount;
    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new LoadMoreButtonView();
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
    render(this.#filmListComponent, this.#loadMoreButtonComponent, RenderPosition.AFTEREND);
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const films = this.films;
    const filmsCount = films.length;

    this.#renderUserProfile();

    if (filmsCount === 0) {
      this.#renderEmptyFilms();
      return;
    }

    this.#renderSort();
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent.element.querySelector('.films-list'), this.#filmListComponent, RenderPosition.BEFOREEND);
    this.#renderFilms(0,  Math.min(filmsCount, this.#renderedFilmCount));
    if (filmsCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#mainContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
  }

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;
    this.#moviePresenter.forEach((movie) => movie.destroy());
    this.#moviePresenter.clear();
    //this.#popupPresenter.destroy();
    //очистить попап презентеры, сохранив тот который открыт
    remove(this.#loadingComponent);
    remove(this.#sortComponent);
    remove(this.#filmsComponent);
    remove(this.#loadMoreButtonComponent);
    if (this.#emptyFilmComponent) {
      remove(this.#emptyFilmComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmsCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #handleViewAction = async (actionType, updateType, update, film, filmId) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        await this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#popupPresenter.setViewState(State.DELETING);
        try {
          await this.#commentsModel.deleteComment(updateType, update, film);
        } catch (error) {
          this.#popupPresenter.setViewState(State.ABORTING);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#popupPresenter.setViewState(State.ADDING);
        try {
          await this.#commentsModel.addComment(updateType, update, film, filmId);
        } catch (error) {
          this.#popupPresenter.setViewState(State.ABORTING);
        }
        break;
    }
  }

  handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenter.get(data.id).init(data);
        this.#popupPresenter.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        //если есть открытый попап то мы его открываем заново по id
        //очищаем переменную с сохраненным попапом
        if (this.#popupPresenter === null) {
          return;
        }
        if (this.#popupPresenter.checkPopup()) {
          this.#popupPresenter.init(data);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true, resetRenderedFilmCount: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  }
}

