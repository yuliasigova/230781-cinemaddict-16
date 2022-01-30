const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = (filmId) => this.#load({url: `comments/${filmId}`}).then(ApiService.parseResponse)
  ;

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deleteComments = async (comment) => {
    const response = await this.#load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });
    return response;
  }

  addComment = async (comment, filmId) => {
    const response = await this.#load({
      url:  `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      'film_info': {
        'title': film.title,
        'alternative_title': film.originalTitle,
        'poster': film.poster,
        'total_rating': film.rating,
        'age_rating': film.ageRating,
        'director': film.director,
        'writers': film.writer,
        'actors': film.actor,
        'release': {
          'release_country': film.country,
          'date': film.date,
        },
        'genre': film.genre,
        'description': film.description,
        'runtime': film.time,
      },
      'user_details': {
        'watchlist': film.isWatchlist,
        'already_watched': film.isWatched,
        'favorite': film.isFavorite,
        'watching_date': film.watchedDate instanceof Date ? film.watchedDate.toISOString() : null
      },
    };

    delete adaptedFilm.title;
    delete adaptedFilm.originalTitle;
    delete adaptedFilm.poster;
    delete adaptedFilm.rating;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.director;
    delete adaptedFilm.writer;
    delete adaptedFilm.actor;
    delete adaptedFilm.country;
    delete adaptedFilm.genre;
    delete adaptedFilm.description;
    delete adaptedFilm.time;
    delete adaptedFilm.date;
    delete adaptedFilm.isWatchlist;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.watchedDate;

    return adaptedFilm;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}

