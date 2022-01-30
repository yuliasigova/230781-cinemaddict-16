import { FilterType } from './constants';

export const sortFilmsDate = (films) => films.sort((a, b) => (a.date > b.date ? -1 : 1));

export const sortFilmsRating = (films) => films.sort((a, b) => (a.rating > b.rating ? -1 : 1));

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};

export const createTime = (time) => ({
  hours: Math.floor(time/60),
  minutes: time%60,
});

export const getTotalTime = (films) => {
  if (films.length === 0) {
    return '0';
  }
  return films.map((film) => film.time).reduce((a, b) => a + b, 0);
};

export const createDescription = (description) => description.length > 140 ? `${description.slice(0, 139)}...` : description;

export const createGenresContent = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');
