import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

export const StatsFilterType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const UserRank = {
  NONE: {
    MAX: 0,
    RANK: '',
  },
  NOVICE: {
    MIN: 1,
    MAX: 10,
    RANK: 'Novice',
  },
  FAN: {
    MIN: 11,
    MAX: 20,
    RANK: 'Fan',
  },
  MOVIE_BUFF: {
    MIN: 21,
    RANK:'Movie Buff',
  },
};

dayjs.extend(isBetween);
const currentDate = dayjs().toDate();
const weekDate = dayjs().subtract(7, 'day').toDate();
const monthDate = dayjs().subtract(1, 'month').toDate();
const yearDate = dayjs().subtract(1, 'year').toDate();

export const filterStats = {
  [StatsFilterType.ALL]: (films) => films.filter((film) => film.isWatched),
  [StatsFilterType.TODAY]: (films) =>  films.filter((film) => film.isWatched && dayjs(film.watchedDate).isSame(currentDate, 'date')),
  [StatsFilterType.WEEK]: (films) => films.filter((film) => film.isWatched && dayjs(film.watchedDate).isBetween(weekDate, currentDate, 'day', [])),
  [StatsFilterType.MONTH]: (films) => films.filter((film) => film.isWatched && dayjs(film.watchedDate).isBetween(monthDate, currentDate, 'month', [])),
  [StatsFilterType.YEAR]: (films) => films.filter((film) => film.isWatched && dayjs(film.watchedDate).isBetween(yearDate, currentDate, 'year', [])),
};

export const getUserRank = (films) => {
  const totalWatch = films.reduce((count, film) => count + Number(film.isWatched), 0);

  if (totalWatch >= UserRank.NOVICE.MIN && totalWatch <= UserRank.NOVICE.MAX) {
    return UserRank.NOVICE.RANK;
  } else if (totalWatch >= UserRank.FAN.MIN && totalWatch <= UserRank.FAN.MAX) {
    return UserRank.FAN.RANK;
  } else if (totalWatch >= UserRank.FAN.MAX) {
    return UserRank.MOVIE_BUFF.RANK;
  } else if (totalWatch === UserRank.NONE.MAX) {
    return UserRank.NONE.RANK;
  }
};

export const getGenres = (films) => {
  const filmGenres = {};
  films.reduce((array, film) => array.concat(film.genre), [])
    .forEach((genre) => {
      if (filmGenres[genre]) {
        filmGenres[genre]++;
        return;
      }
      filmGenres[genre] = 1;
    });
  return Object.entries(filmGenres).sort((a,b)=>b[1]-a[1]);
};

export const getFirstGenre = (films) =>{
  const firstElem = getGenres(films);
  const firstGenre = {...firstElem[0]};
  if (films.length === 0) {
    return '';
  }
  return firstGenre[0];
};
