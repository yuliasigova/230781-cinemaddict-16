import dayjs from 'dayjs';
import { createElement } from '../render';

const createDescription = (description) => description.length > 140 ? `${description.slice(0, 139)}...` : description;


const createFilmElement = (film) => {
  const {id, title, poster, description, rating, date, time, genre, isWatchlist, isWatched, isFavorite, comments} = film;
  const activeClassName = (status) => status ? 'film-card__controls-item--active': '';
  return `<article class="film-card">
  <a class="film-card__link" data-id=${id}>
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(date).format('YYYY')}</span>
      <span class="film-card__duration">${time}</span>
      <span class="film-card__genre">${genre[0]}</span>
    </p>
    <img src=${poster} alt="" class="film-card__poster">
    <p class="film-card__description">${createDescription(description)}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${activeClassName(isWatchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${activeClassName(isWatched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${activeClassName(isFavorite)}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmElement(this.#film);
  }

  removeElement() {
    this.#element = null;
  }
}
