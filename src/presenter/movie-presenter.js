import { render, RenderPosition } from '../render';
import FilmView from '../view/film-card';
import FilmPopupView from '../view/film-popup';
import {isEscKey} from '../mock/util';

export default class MoviePresenter {
  #filmListContainer = null;
  #filmComponent = null;
  #filmPopupComponent = null;
  #film = null;
  #changeData = null;

  constructor(filmListContainer, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmView(film);
    this.#filmPopupComponent = new FilmPopupView(film);

    this.#filmComponent.setFilmClickHandler(this.#filmClickHandler);
    this.#filmComponent.setWatchlistButtonClickHandler(this.#watchlistClickHandler);
    this.#filmComponent.setWatchedButtonClickHandler(this.#watchedClickHandler);
    this.#filmComponent.setFavoriteButtonClickHandler(this.#favoriteClickHandler);
    this.#filmPopupComponent.setWatchedPopupClickHandler(this.#watchedClickHandler);
    this.#filmPopupComponent.setWatchlistPopupClickHandler(this.#watchlistClickHandler);
    this.#filmPopupComponent.setFavoritePopupClickHandler(this.#favoriteClickHandler);
    this.#filmPopupComponent.setPopupClickHandler(this.#popupClickHandler);

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmListContainer.element.contains(prevFilmComponent.element)) {
      this.#filmListContainer.element.replaceChild(this.#filmComponent.element, prevFilmComponent.element);
    }

    if (document.body.contains(prevFilmPopupComponent.element)) {
      document.body.replaceChild(this.#filmPopupComponent.element, prevFilmPopupComponent.element);
    }

    prevFilmComponent.element.remove();
    prevFilmComponent.removeElement();
    prevFilmPopupComponent.element.remove();
    prevFilmPopupComponent.removeElement();
  }

  #watchlistClickHandler = () => {
    this.#changeData({...this.#film, isWatchlist: !this.#film.isWatchlist});
  }

  #watchedClickHandler = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  }

  #favoriteClickHandler = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  }

  #addFilmPopup = () => {
    document.body.classList.add('hide-overflow');
    document.body.appendChild(this.#filmPopupComponent.element);
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #removeFilmPopup = () => {
    document.body.classList.remove('hide-overflow');
    document.body.removeChild(this.#filmPopupComponent.element);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.#removeFilmPopup();
    }
  };

  #filmClickHandler = () => {
    this.#clearPopup();
    this.#addFilmPopup();
  }

  #popupClickHandler = () => {
    this.#removeFilmPopup();
  }

  #clearPopup = () => {
    const popup = document.querySelector('.film-details');
    if (document.body.contains(popup)) {
      document.body.removeChild(popup);
    }
  }

}

