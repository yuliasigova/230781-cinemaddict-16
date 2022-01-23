export const getRandomNumber = function (min, max, sign = 0) {
  if (sign === 0) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  return (Math.random() * (max - min) + min).toFixed(sign);
};

export const getRandomList = (list) => {
  const elements = [];
  while (elements.length <= getRandomNumber(0, list.length)) {
    const randomNumber = getRandomNumber(0, list.length - 1);
    if (elements.indexOf(list[randomNumber]) === -1) {
      elements.push(list[randomNumber]);
    }
  }
  return elements;
};

const createId = ()=> {
  let lastdId = 0;

  return () => {
    lastdId += 1;
    return lastdId;
  };
};

export const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const idNumber = createId();

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const sortFilmsDate = (films) => films.sort((a, b) => (a.date > b.date ? -1 : 1));

export const sortFilmsRating = (films) => films.sort((a, b) => (a.rating > b.rating ? -1 : 1));

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'all',
  FAVORITES: 'favorites',
  HISTORY: 'history',
  WATCHLIST: 'watchlist',
};

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};

export const createTime = (time) => {
  const hours = Math.floor(time/60);
  const minutes = time%60;
  return `${hours}h ${minutes}m`;
};

export const MenuItem = {
  FILMS: 'FILMS',
  STATISTICS: 'STATISTICS',
};

export const EMOTIONS =[ 'smile', 'sleeping', 'puke', 'angry'];
