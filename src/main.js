import { createMenuTemplate } from './view/site-menu';
import { createUserLogoTemplate } from './view/user-logo';
import { createFilmElement } from './view/film-card';
import { createFilmsContainerElement } from './view/film-container';
import { createLoadMoreButtonTemplate } from './view/load-more-button';
import { createFilmPopupElement } from './view/film-popup';
import { generateFilm } from './mock/film';
import { createFilmStatisticElement } from './view/film-stats';
import { filterFavoriteList } from './mock/util';
import { filterWatchedList } from './mock/util';
import { filterWatchList } from './mock/util';

const FILM_COUNT = 30;
const FILM_COUNT_PER_STEP = 5;
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const containerStatsElement = siteFooterElement.querySelector('.footer__statistics');

siteHeaderElement.insertAdjacentHTML('beforeend', createUserLogoTemplate());
siteMainElement.insertAdjacentHTML('beforeend', createFilmsContainerElement());
containerStatsElement.insertAdjacentHTML('beforeend', createFilmStatisticElement(FILM_COUNT));

const filmListElement = siteMainElement.querySelector('.films-list');
const filmContainer = filmListElement.querySelector('.films-list__container');

filmListElement.insertAdjacentHTML('beforeend', createLoadMoreButtonTemplate());

const films = Array.from({length: FILM_COUNT}, generateFilm);

for (let i = 0; i < FILM_COUNT_PER_STEP ; i++) {
  filmContainer.insertAdjacentHTML('beforeend', createFilmElement(films[i]));
}

const removePopup = () => {
  const cardPopup = document.querySelector('.film-details');
  const closePopupButton = cardPopup.querySelector('.film-details__close-btn');
  closePopupButton.addEventListener('click', () => cardPopup.remove()
  );
};
const addPopup = () => {
  const filmPopupElement = document.querySelectorAll('.film-card__link');
  filmPopupElement.forEach((element) => element.addEventListener('click', () => {
    const film = films.find((filmElement)=>filmElement.id === Number(element.dataset.id));
    siteFooterElement.insertAdjacentHTML('afterend', createFilmPopupElement(film));
    removePopup();
  })
  );
};
addPopup();
const loadMoreButton = filmListElement.querySelector('.films-list__show-more');

let renderedFilmCount = FILM_COUNT_PER_STEP;

loadMoreButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  films
    .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
    .forEach((film) => filmContainer.insertAdjacentHTML('beforeend', createFilmElement(film)));
  renderedFilmCount += FILM_COUNT_PER_STEP;
  addPopup();
  if (renderedFilmCount >= films.length) {
    loadMoreButton.remove();
  }
});

const filterFavoriteFilm = filterFavoriteList(films);
const filterWatchedFilm = filterWatchedList(films);
const filterWatchFilm = filterWatchList(films);

siteMainElement.insertAdjacentHTML('afterbegin', createMenuTemplate(filterWatchedFilm, filterWatchFilm,filterFavoriteFilm));
