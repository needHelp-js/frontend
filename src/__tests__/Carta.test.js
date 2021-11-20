import React from "react";
import { victimsNames } from "../utils/constants";
import Carta from "../components/Carta";
import { getCardSource } from "../utils/utils";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";

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

describe("Carta", () => {
  it("renderiza correctamente las cartas", () => {
    act(() => {
      render(<Carta cardName={victimsNames.CONDE} />, container);
    });

    const imgSrc = getCardSource(victimsNames.CONDE);

    const imageElement = container.firstChild.firstChild;

    expect(imageElement.alt).toBe(victimsNames.CONDE);
    expect(imageElement.src).toMatch(new RegExp(`${imgSrc}$`));
    expect(imageElement.width).toBe(150);
    expect(imageElement.height).toBe(300);
  });

  it("verifica que las propiedades de tamaño se asignen correctamente", () => {
    const fixedSize = 500;
    act(() => {
      render(
        <Carta
          cardName={victimsNames.CONDE}
          width={fixedSize}
          height={fixedSize}
        />,
        container
      );
    });

    const imageElement = container.firstChild.firstChild;
    expect(imageElement.width).toBe(fixedSize);
    expect(imageElement.height).toBe(fixedSize);
  });
});
