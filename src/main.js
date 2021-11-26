import { createMenuTemplate } from './view/site-menu';
import { createUserLogoTemplate } from './view/user-logo';
import { createFilmElement } from './view/film-card';
import { createFilmsContainerElement } from './view/film-container';
import { createLoadMoreButtonTemplate } from './view/load-more-button';
import { createFilmPopupElement } from './view/film-popup';

const FILM_COUNT = 5;
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

siteMainElement.insertAdjacentHTML('beforeend', createMenuTemplate());
siteHeaderElement.insertAdjacentHTML('beforeend', createUserLogoTemplate());
siteMainElement.insertAdjacentHTML('beforeend', createFilmsContainerElement());
siteFooterElement.insertAdjacentHTML('afterend', createFilmPopupElement());

const filmListElement = siteMainElement.querySelector('.films-list');
const filmContainer = filmListElement.querySelector('.films-list__container');

filmListElement.insertAdjacentHTML('beforeend', createLoadMoreButtonTemplate());
for (let i = 0; i < FILM_COUNT; i++) {
  filmContainer.insertAdjacentHTML('beforeend', createFilmElement());
}

