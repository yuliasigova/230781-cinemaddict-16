import AbstractObservable from '../utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {
  #comments = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (filmId) => {
    try {
      this.#comments = await this.#apiService.getComments(filmId);
      return this.#comments;
    } catch(error) {
      this.#comments = [];
    }
  }

  addComment = async (updateType, update, film, filmId) => {
    try {
      const response = await this.#apiService.addComment(update, filmId);
      this.#comments = [
        response,
        ...this.#comments,
      ];
      film = {...film, comments: response.movie.comments};
      this._notify(updateType, film);
    } catch(error) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, update, film) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComments(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      film = {...film, comments: film.comments.filter((comment) => comment !== update.id)};
      this._notify(updateType, film);
    } catch(error) {
      throw new Error('Can\'t delete comment');
    }
  }
}
