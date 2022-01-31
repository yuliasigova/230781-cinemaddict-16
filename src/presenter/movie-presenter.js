import { render, RenderPosition, remove} from '../utils/render.js';
import FilmView from '../view/film-view.js';
import { UserAction, UpdateType} from '../utils/constants.js';

export default class MoviePresenter {
  #filmListContainer = null;
  #filmComponent = null;
  #film = null;
  #changeData = null;
  #initPopup = null;

  constructor(filmListContainer, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmView(film);

    this.#filmComponent.setFilmClickHandler(this.#addFilmPopup);
    this.#filmComponent.setWatchlistButtonClickHandler(this.#watchlistClickHandler);
    this.#filmComponent.setWatchedButtonClickHandler(this.#watchedClickHandler);
    this.#filmComponent.setFavoriteButtonClickHandler(this.#favoriteClickHandler);

    if (prevFilmComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmListContainer.element.contains(prevFilmComponent.element)) {
      this.#filmListContainer.element.replaceChild(this.#filmComponent.element, prevFilmComponent.element);
    }

    remove(prevFilmComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
  }

  setFilmPopup = (initPopup) => {
    this.#initPopup = initPopup;
  }

  #watchlistClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,{...this.#film, isWatchlist: !this.#film.isWatchlist});
  }

  #watchedClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR, {...this.#film, isWatched: !this.#film.isWatched});
  }

  #favoriteClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,{...this.#film, isFavorite: !this.#film.isFavorite});
  };

  #addFilmPopup = () => {
    this.#initPopup();
  }
}
