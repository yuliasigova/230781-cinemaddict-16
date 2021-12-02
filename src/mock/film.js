import { getRandomNumber, getRandomList, idNumber } from './util.js';
import dayjs from 'dayjs';
import { generateComment } from './comments.js';

const  POSTERS = {
  'The Man with the Golden Arm': './images/posters/the-man-with-the-golden-arm.jpg',
  'The Great Flamarion': './images/posters/the-great-flamarion.jpg',
  'The Dance of Life': './images/posters/the-dance-of-life.jpg',
  'Santa Claus Conquers the Martians': './images/posters/santa-claus-conquers-the-martians.jpg',
  'Made for Each Other':'./images/posters/made-for-each-other.png',
  'Sagebrush Trail': './images/posters/sagebrush-trail.jpg',
  'Popeye the Sailor Meets Sindbad the Sailor': './images/posters/popeye-meets-sinbad.png',
};
const TITLES = Object.keys(POSTERS);
const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget','Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.','Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis', 'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'];
const DIRECTORS = ['Alfred Hitchcock', 'Lars von Trier', 'Darren Aronofsky', 'Wes Anderson', 'Quentin Tarantino', 'Christopher Nolan', 'David Fincher', 'Denis Villeneuve'];
const WRITERS = ['Stan Lee', 'Jack Kirby','Quentin Tarantino', 'Christopher Nolan', 'Joel Coen', 'Ingmar Bergman','Wes Anderson'];
const ACTORS = ['Helena Bonham Carter', 'Christian Bale', 'Brad Pitt', 'Jake Gyllenhaal', 'Scarlett Johansson', 'Timothée Chalamet', 'Leonardo DiCaprio', 'Natalie Portman', 'Bill Murray', 'Kate Winslet', 'Tilda Swinton'];
const COUNTRY = [ 'United States', 'China', 'Australia', 'France', 'Canada', 'Germany','United Kingdom'];
const GENRES = ['Comedy', 'Crime', 'Drama', 'Adventure', 'Fantasy', 'Horror', 'Western', 'Thriller'];
const AGE_RATING = ['0+', '6+', '12+', '16+', '18+'];

export const generateFilm = () => {
  const title = TITLES[getRandomNumber(0, TITLES.length-1)];
  return {
    id: idNumber(),
    title,
    originalTitle: title,
    poster: POSTERS[title],
    rating: getRandomNumber(1, 10, 1),
    director: DIRECTORS[getRandomNumber(0, DIRECTORS.length-1)],
    writer: getRandomList(WRITERS),
    actor: getRandomList(ACTORS),
    country: getRandomList(COUNTRY),
    genre: getRandomList(GENRES),
    ageRating: AGE_RATING[getRandomNumber(0, AGE_RATING.length-1)],
    description: DESCRIPTIONS[getRandomNumber(0, DESCRIPTIONS.length-1)],
    time: `${getRandomNumber(1, 3)}h ${getRandomNumber(1, 59)}m`,
    date: dayjs().add(getRandomNumber(-31, 0), 'day').add(getRandomNumber(-12, 0), 'month').add(getRandomNumber(-50, 0), 'year').toDate(''),
    comments: (Array.from({length: getRandomNumber(1,10)}, generateComment)),
    isWatchlist: (Boolean(getRandomNumber(0, 1))),
    isWatched: Boolean(getRandomNumber(0, 1)),
    isFavorite: Boolean(getRandomNumber(0, 1)),
  };
};

