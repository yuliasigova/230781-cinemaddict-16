import { getRandomNumber } from './util';
import dayjs from 'dayjs';

const EMOTIONS = ['./images/emoji/smile.png',
  './images/emoji/sleeping.png',
  './images/emoji/puke.png',
  './images/emoji/angry.png'];
const COMMENTS = ['great', 'boring', 'awesome film', 'awful', 'amazing!'];
const AUTHORS = ['Ilya O"Reilly', 'John Doe', 'Tim Macoveev'];

export const generateComment = () => (
  {
    id: getRandomNumber(1, 30),
    author: AUTHORS[getRandomNumber(0, AUTHORS.length-1)],
    emotion: EMOTIONS[getRandomNumber(0, EMOTIONS.length-1)],
    text: COMMENTS[getRandomNumber(0, COMMENTS.length-1)],
    date: dayjs().add(getRandomNumber(-31, 0), 'day').add(getRandomNumber(-12, 0), 'month').add(getRandomNumber(-50, 0), 'year').toDate(''),
  }
);
