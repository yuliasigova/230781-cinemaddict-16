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

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const idNumber = createId();
export const filterWatchList = (films) => films.filter((film) => film.isWatchlist);
export const filterWatchedList = (films) => films.filter((film) => film.isWatched);
export const filterFavoriteList = (films) => films.filter((film) => film.isFavorite);

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const sortFilmsDate = (films) => films.sort((a, b) => (a.date > b.date ? -1 : 1));

export const sortFilmsRating = (films) => films.sort((a, b) => (a.rating > b.rating ? -1 : 1));
