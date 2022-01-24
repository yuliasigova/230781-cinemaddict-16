import dayjs from 'dayjs';
import he from 'he';
import SmartView from './smart-view.js';
import { createTime, EMOTIONS } from '../mock/util.js';

const createGenresContent = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

const addComments = (comments) => comments.map(({id, author, date, comment, emotion}) =>
  `<li class="film-details__comment">
<span class="film-details__comment-emoji">
  <img src='./images/emoji/${emotion}.png' width="55" height="55" alt="emoji-smile">
</span>
<div>
  <p class="film-details__comment-text">${comment}</p>
  <p class="film-details__comment-info">
    <span class="film-details__comment-author">${author}</span>
    <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:MM')}</span>
    <button class="film-details__comment-delete" data-comment-id=${id}>Delete</button>
  </p>
</div>
</li>`).join('');


const createEmoji = () => EMOTIONS.map((emotion) =>
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
  <label class="film-details__emoji-label" for="emoji-${emotion}">
  <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="${emotion}">
  </label>`).join('');

const createGenre = (genre) => genre.length > 1 ? 'Genres' : 'Genre';

const createFilmPopupElement = (data, filmComments) => {
  const {title, originalTitle, poster, description, rating, director, writer, country, ageRating, actor, time, date, genre, isWatchlist, isWatched, isFavorite, isEmoji, isComment, comments} = data;
  const activeClassName = (status) => status ? 'film-details__control-button--active': '';
  const userComments = filmComments;
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${poster} alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writer.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actor.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(date).format('DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${createTime(time)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${createGenre(genre)}</td>
              <td class="film-details__cell">
              ${createGenresContent(genre)}
            </tr>
          </table>

          <p class="film-details__film-description">
           ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist     ${activeClassName(isWatchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched
        ${activeClassName(isWatched)}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite
        ${activeClassName(isFavorite)}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list"></ul>
          ${addComments(userComments)}
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${isEmoji ? `
          <img src="images/emoji/${isEmoji}.png" width="55" height="55" alt="emoji-${isEmoji}">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(isComment === null ? '' : isComment)}</textarea>
          </label>

          <div class="film-details__emoji-list">
          ${createEmoji()}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPopupView extends SmartView {
  #film = null;
  #comments = null;

  constructor(film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
    this._data = FilmPopupView.parseFilmToData(film);
    this.setInnerHandlers();
  }

  get template() {
    return createFilmPopupElement(this._data, this.#comments);
  }

  setPopupClickHandler = (callback) => {
    this._callback.popupClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupClickHandler);
  }

  #popupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupClick(FilmPopupView.parseDataToFilm(this._data));
  }

  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => button.addEventListener('click', this.#deleteCommentClickHandler));
  }

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    const idComment = evt.target.dataset.commentId;
    this._callback.deleteClick(idComment);
  }

  setAddCommentClickHandler = (callback) => {
    this._callback.addComment = callback;
    this.element.querySelector('form').addEventListener('keydown', this.#formKeydownHandler);
  }

  #formKeydownHandler = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter' || evt.metaKey && evt.key === 'Enter'){
      if (this._data.isComment === '' || this._data.isEmoji === '') {
        return;
      }
      const newComment = {
        comment: this._data.isComment,
        emotion: this._data.isEmoji,
      };
      this._callback.addComment(newComment);
    }
  }

  setWatchlistPopupClickHandler = (callback) => {
    this._callback.watchlistPopupClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistPopupClickHandler);
  }

  #watchlistPopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistPopupClick();
  }

  setWatchedPopupClickHandler = (callback) => {
    this._callback.watchedPopupClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedPopupClickHandler);
  }

  #watchedPopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedPopupClick();
  }

  setFavoritePopupClickHandler = (callback) => {
    this._callback.favoritePopupClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoritePopupClickHandler);
  }

  #favoritePopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoritePopupClick();
  }

  static parseFilmToData = (film) => ({...film,
    isEmoji: film.isEmoji,
    isComment: null,
  });

  static parseDataToFilm = (data) => {
    const film = {...data};
    delete film.isEmoji;
    delete film.isComment;

    return film;
  };

  setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-item').forEach((input) => input.addEventListener('change', this.#emojiClickHandler));

    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);

  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      isEmoji: evt.target.value
    });
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      isComment: evt.target.value,
    }, true);
  }

  restoreHandlers = () => {
    this.setInnerHandlers();
    this.setPopupClickHandler(this._callback.popupClick);
    this.setWatchlistPopupClickHandler(this._callback.watchlistPopupClick);
    this.setWatchedPopupClickHandler(this._callback.watchedPopupClick);
    this.setFavoritePopupClickHandler(this._callback.favoritePopupClick);
    this.setDeleteCommentClickHandler(this._callback.deleteClick);
    this.setAddCommentClickHandler(this._callback.addComment);
  };

}
