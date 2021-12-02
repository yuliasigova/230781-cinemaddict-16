export const getRandomNumber = function (min, max, sign = 0) {
  if (sign === 0) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  } else {
    return (Math.random() * (max - min) + min).toFixed(sign);
  }
};

getRandomNumber();

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

  return function () {
    lastdId += 1;
    return lastdId;
  };
};

export const idNumber = createId();
export const filterWatchList = (films) => films.filter((film) => film.isWatchlist);
export const filterWatchedList = (films) => films.filter((film) => film.isWatched);
export const filterFavoriteList = (films) => films.filter((film) => film.isFavorite);
