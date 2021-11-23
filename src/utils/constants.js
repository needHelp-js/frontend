const cardTypes = {
  VICTIM: 'victima',
  MONSTER: 'monstruo',
  ROOM: 'recinto',
};

const victimsNames = {
  CONDE: 'Conde',
  CONDESA: 'Condesa',
  AMA_DE_LLAVES: 'Ama de llaves',
  MAYORDOMO: 'Mayordomo',
  DONCELLA: 'Doncella',
  JARDINERO: 'Jardinero',
};

const monstersNames = {
  DRACULA: 'Drácula',
  FRANKENSTEIN: 'Frankenstein',
  HOMBRE_LOBO: 'Hombre Lobo',
  FANTASMA: 'Fantasma',
  MOMIA: 'Momia',
  DR_JEKYLL_MR_HYDE: 'Dr. Jekyll Mr Hyde',
};

const roomsNames = {
  COCHERA: 'Cochera',
  ALCOBA: 'Alcoba',
  BIBLIOTECA: 'Biblioteca',
  PANTEON: 'Panteon',
  LABORATORIO: 'Laboratorio',
  SALON: 'Salon',
  BODEGA: 'Bodega',
  VESTIBULO: 'Vestibulo',
};

const ASSETS_PATH = 'assets';

const accusationState = {
  NOT_ACCUSING: 0,
  ACCUSING: 1,
  WAITING_FOR_ACCUSATION_RESPONSE: 2,
  ACCUSATION_COMPLETED: 3
};

export {
  cardTypes, victimsNames, monstersNames, roomsNames, ASSETS_PATH, accusationState
};
