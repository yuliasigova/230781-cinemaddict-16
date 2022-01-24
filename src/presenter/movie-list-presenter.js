import { remove, render, RenderPosition } from '../render';
import NoFilmView from '../view/no-film';
import SortView from '../view/film-sort';
import FilmsContainerView from '../view/film-container';
import FilmsListContainerView from '../view/film-list-container';
import LoadMoreButtonView  from '../view/load-more-button';
import MoviePresenter from './movie-presenter';
import { SortType, sortFilmsDate, sortFilmsRating, UpdateType, UserAction, filter, FilterType} from '../mock/util';
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

  constructor(mainContainer, filmsModel, filterModel, commentsModel){
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.handleModelEvent);
    this.#filterModel.addObserver(this.handleModelEvent);
    this.#commentsModel.addObserver(this.handleModelEvent);
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
    this.#renderBoard();
  }

  #renderFilm = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmListComponent, this.#handleViewAction);
    moviePresenter.init(film);
    this.initPopup = () => this.#createPopup(film);
    moviePresenter.setFilmPopup(this.initPopup);
    this.#moviePresenter.set(film.id, moviePresenter);
  }

  #createPopup = (film) => {
    this.#popupPresenter = new PopupPresenter(document.body, this.#handleViewAction, this.#commentsModel);
    const popup = document.querySelector('.film-details');
    if (document.body.contains(popup)) {
      document.body.removeChild(popup);
    }
    this.#popupPresenter.init(film);
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

  #handleLoadMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.films.length) {
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
    if (filmsCount === 0) {
      this.#renderEmptyFilms();
      return;
    }
    this.#renderSort();
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent.element.querySelector('.films-list'), this.#filmListComponent, RenderPosition.BEFOREEND);
    this.#renderFilms(0,  this.#renderedFilmCount);
    this.#renderLoadMoreButton();
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
    this.#clearTaskList();
    this.#renderBoard();
  }

  #clearTaskList = ({resetSortType = false} = {}) => {
    this.#moviePresenter.forEach((movie) => movie.destroy());
    this.#moviePresenter.clear();
    //this.#popupPresenter.destroy();
    // this.#popupPresenter.clear();
    //очистить попап презентеры, сохранив тот который открыт
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#loadingComponent);
    remove(this.#sortComponent);
    remove(this.#filmsComponent);
    remove(this.#loadMoreButtonComponent);
    if(this.#emptyFilmComponent) {
      remove(this.#emptyFilmComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #handleViewAction = (actionType, updateType, update, film, filmId) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update, film);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update, film, filmId);
        break;
    }
  }

  handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenter.get(data.id).init(data);
        this.#createPopup(data);
        break;
      case UpdateType.MINOR:
        this.#clearTaskList({resetSortType: true});
        this.#renderBoard();  //если есть открытый попап то мы его открываем заново по id//очищаем переменную с сохраненным попапом
        if (this.#popupPresenter === null) {
          return;
        }
        if (this.#popupPresenter.checkPopup()) {
          this.#createPopup(data);
        }
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  }
}

