import { render, RenderPosition, remove} from '../render';
import FilmPopupView from '../view/film-popup';
import {isEscKey, UserAction, UpdateType} from '../mock/util';

export default class PopupPresenter {
  #filmPopupContainer = null;
  #filmPopupComponent = null;
  #film = null;
  #changeData = null;
  #isOpen = false;
  #commentsModel = null;
  #comments = null;

  constructor(filmPopupContainer, changeData, commentsModel ) {
    this.#filmPopupContainer = filmPopupContainer;
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
  }


  init = async (film) => {
    this.#film = film;
    this.#isOpen = true;
    const id = film.id;
    this.#comments  = await this.#commentsModel.init(id);

    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmPopupComponent = new FilmPopupView(film, this.#comments);

    this.#filmPopupComponent.setWatchedPopupClickHandler(this.#watchedClickHandler);
    this.#filmPopupComponent.setWatchlistPopupClickHandler(this.#watchlistClickHandler);
    this.#filmPopupComponent.setFavoritePopupClickHandler(this.#favoriteClickHandler);
    this.#filmPopupComponent.setPopupClickHandler(this.#popupClickHandler);
    this.#filmPopupComponent.setDeleteCommentClickHandler(this.#buttonRemoveCommentClickHandler);
    this.#filmPopupComponent.setAddCommentClickHandler(this.#addComment);

    if (prevFilmPopupComponent !== null) {
      render(this.#filmPopupContainer, this.#filmPopupComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmPopupContainer.contains(prevFilmPopupComponent)) {
      this.#filmPopupContainer.replaceChild(this.#filmPopupComponent.element, prevFilmPopupComponent);
    }

    document.addEventListener('keydown', this.#onEscKeyDown);
    document.body.classList.add('hide-overflow');
    render(this.#filmPopupContainer,this.#filmPopupComponent, RenderPosition.BEFOREEND);

    remove(prevFilmPopupComponent);
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
      UpdateType.MINOR, {...this.#film, isFavorite: !this.#film.isFavorite});
  }

  #onEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }

  #popupClickHandler = () => {
    this.destroy();
  }

  destroy = () => {
    if (this.#filmPopupComponent === null){
      return;
    }
    this.#isOpen = false;
    document.body.classList.remove('hide-overflow');
    remove(this.#filmPopupComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  checkPopup = () => this.#isOpen;

  #buttonRemoveCommentClickHandler = (id) =>{
    const update = this.#comments.find((comment) => comment.id ===id);
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH, update, {...this.#film});
  };

  #addComment = (newComment) => {
    const id = this.#film.id;
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH, newComment, {...this.#film}, id);
  }
}

