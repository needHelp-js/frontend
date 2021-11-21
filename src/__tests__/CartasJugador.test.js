import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from 'react-dom';
import { victimsNames } from '../utils/constants';
import { getCardSource } from '../utils/utils';
import CartasJugador from '../components/CartasJugador';

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('CartasJugador', () => {
  it('renderiza correctamente las cartas del jugador', () => {
    const cards = [
      victimsNames.CONDE,
      victimsNames.AMA_DE_LLAVES,
      victimsNames.CONDESA,
      victimsNames.DONCELLA,
    ];
    act(() => {
      render(<CartasJugador cards={cards} />, container);
    });

    const cardElems = container.firstChild.children;

    for (let i = 0; i < cardElems.length; i += 1) {
      const imageElem = cardElems[i].firstChild;
      const elem = cards[i];
      const imgSrc = getCardSource(elem);

      expect(imageElem.alt).toBe(elem);
      expect(imageElem.src).toMatch(new RegExp(`${imgSrc}$`));
    }
  });
});
