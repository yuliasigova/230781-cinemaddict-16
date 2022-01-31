import ParentView from '../view/parent-view.js';

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const render = (container, element, place) => {
  const parent = container instanceof ParentView ? container.element : container;
  const child = element instanceof ParentView ? element.element : element;
  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      parent.append(child);
      break;
    case RenderPosition.AFTEREND:
      parent.after(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof ParentView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
};
