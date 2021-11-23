import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RespuestaSospecha from '../components/RespuestaSospecha';

const MOCK_SUSPECTED_CARDS = ['Jardinero', 'Fantasma', 'Cochera'];
const MOCK_RESPONSE_CARD = 'Jardinero';

describe('Responder Sospecha', () => {
  it('Renderiza todas las cartas sobre las que hay que responder', async () => {
    render(
      <RespuestaSospecha
        suspectedCards={MOCK_SUSPECTED_CARDS}
      />,
    );

    expect(screen.getByRole('img', { name: /Jardinero/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Fantasma/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Cochera/ })).toBeInTheDocument();
  });

  it('Permite elegir una carta', async () => {
    render(
      <RespuestaSospecha
        suspectedCards={MOCK_SUSPECTED_CARDS}
      />,
    );

    userEvent.click(await screen.findByRole('img', { name: 'Jardinero' }));
    const jardinero = screen.getByRole('img', { name: /Jardinero/ });
    const selectedCard = document.getElementsByClassName('selectedCard')[0];
    expect(jardinero === selectedCard).toBe(true);
  });

  it('Permite elegir solo una carta por vez', async () => {
    render(
      <RespuestaSospecha
        suspectedCards={MOCK_SUSPECTED_CARDS}
      />,
    );

    userEvent.click(await screen.findByRole('img', { name: 'Jardinero' }));
    const jardinero = screen.getByRole('img', { name: /Jardinero/ });
    let selectedCard = document.getElementsByClassName('selectedCard')[0];
    expect(jardinero).toBe(selectedCard);
    userEvent.click(await screen.findByRole('img', { name: 'Fantasma' }));
    const fantasma = screen.getByRole('img', { name: /Fantasma/ });
    selectedCard = document.getElementsByClassName('selectedCard')[0];
    expect(fantasma).toBe(selectedCard);
    expect(jardinero).not.toBe(selectedCard);
  });

  it('Muestra la respuesta a una sospecha', async () => {
    render(
      <RespuestaSospecha
        cartaRespuesta={MOCK_RESPONSE_CARD}
        mostrandoRespuesta
      />,
    );

    expect(screen.getByRole('img', { name: 'Jardinero' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
