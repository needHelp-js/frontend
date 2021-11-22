import {
  victimsNames, monstersNames, roomsNames, ASSETS_PATH,
} from './constants';

/**
 * Returns the card image path from a card name.
 *
 * @param {String} cardName Card name.
 * @returns image path
 */
export function getCardSource(cardName) {
  let result;

  switch (cardName) {
    case victimsNames.AMA_DE_LLAVES:
      result = 'ama_de_llaves';
      break;
    case victimsNames.CONDE:
      result = 'conde';
      break;
    case victimsNames.CONDESA:
      result = 'condesa';
      break;
    case victimsNames.DONCELLA:
      result = 'doncella';
      break;
    case victimsNames.JARDINERO:
      result = 'jardinero';
      break;
    case victimsNames.MAYORDOMO:
      result = 'mayordomo';
      break;
    case monstersNames.DRACULA:
      result = 'dracula';
      break;
    case monstersNames.DR_JEKYLL_MR_HYDE:
      result = 'Jekyll_hyde';
      break;
    case monstersNames.FANTASMA:
      result = 'fantasma';
      break;
    case monstersNames.FRANKENSTEIN:
      result = 'frankenstein';
      break;
    case monstersNames.HOMBRE_LOBO:
      result = 'hombre_lobo';
      break;
    case monstersNames.MOMIA:
      result = 'momia';
      break;
    case roomsNames.ALCOBA:
      result = 'alcoba';
      break;
    case roomsNames.BIBLIOTECA:
      result = 'biblioteca';
      break;
    case roomsNames.BODEGA:
      result = 'bodega';
      break;
    case roomsNames.COCHERA:
      result = 'cochera';
      break;
    case roomsNames.LABORATORIO:
      result = 'laboratorio';
      break;
    case roomsNames.PANTEON:
      result = 'panteon';
      break;
    case roomsNames.SALON:
      result = 'salon';
      break;
    case roomsNames.VESTIBULO:
      result = 'vestibulo';
      break;
    default:
      result = null;
  }

  if (result === null) {
    return null;
  }

  return `${ASSETS_PATH}/Misterio_cartas/${result}.png`;
}
