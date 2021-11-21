import React from "react";
import { victimsNames } from "../utils/constants";
import { getCardSource } from "../utils/utils";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import CartasJugador from "../components/CartasJugador";

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("CartasJugador", () => {
  it("renderiza correctamente las cartas del jugador", () => {
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

    let idx = 0;
    for (const cardElem of cardElems) {
        let imageElem = cardElem.firstChild;
        let elem = cards[idx];
        let imgSrc = getCardSource(elem);

        expect(imageElem.alt).toBe(elem);
        expect(imageElem.src).toMatch(new RegExp(`${imgSrc}$`));
        idx++;
    }
  });
});