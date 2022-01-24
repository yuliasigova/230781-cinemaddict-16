import AbstractObservable from '../mock/abstract-observable';
import { UpdateType } from '../mock/util';

export default class FilmsModel extends AbstractObservable {
  #films = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }
    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  }

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      title: film.film_info.title,
      originalTitle: film.film_info.alternative_title,
      poster: film.film_info.poster,
      rating: film.film_info.total_rating,
      ageRating: film.film_info.age_rating,
      director: film.film_info.director,
      writer: film.film_info.writers,
      actor: film.film_info.actors,
      country: film.film_info.release.release_country,
      genre: film.film_info.genre,
      description: film.film_info.description,
      time: film.film_info.runtime,
      date: film.film_info.release.date,
      isWatchlist: film.user_details.watchlist,
      isWatched: film.user_details.already_watched,
      isFavorite: film.user_details.favorite,
      watchedDate: film.user_details.watching_date !== null ? new Date(film.user_details.watching_date) : film.user_details.watching_date,
    };

    delete adaptedFilm.film_info.title;
    delete adaptedFilm.film_info.alternative_title;
    delete adaptedFilm.film_info.poster;
    delete adaptedFilm.film_info.total_rating;
    delete adaptedFilm.film_info.age_rating;
    delete adaptedFilm.film_info.director;
    delete adaptedFilm.film_info.writers;
    delete adaptedFilm.film_info.actors;
    delete adaptedFilm.film_info.release;
    delete adaptedFilm.film_info.genre;
    delete adaptedFilm.film_info.description;
    delete adaptedFilm.film_info.runtime;
    delete adaptedFilm.user_details.watchlist;
    delete adaptedFilm.user_details.already_watched;
    delete adaptedFilm.user_details.favorite;
    delete adaptedFilm.user_details.watching_date;

    return adaptedFilm;
  }
}
