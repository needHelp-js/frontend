import React from 'react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Sospechar from '../components/Sospechar/Sospechar';

const idPartida = 1;
const idPlayer = 1;
const nombrePartida = 'nombreDeLaPartida';
const card1Name = 'Jardinero';
const card2Name = 'Momia';



const errorNingunRecinto = {
  Error: `El jugador${idPlayer} no esta en ningun recinto`
}


const urlServer = `${process.env.REACT_APP_URL_SERVER}/${idPartida}/suspect/${idPlayer}`;
const server = setupServer(
  rest.post(urlServer, (req, res, ctx) => {
    localStorage.setItem('postRecibido',true);
    return res(
      ctx.status(200),
    );
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Sospechar', () => {
  it('Se renderiza correctamente', async () => {
    render(
      <Sospechar
        suspecting
        setHasError={() => {}}
      />
    );

    expect(screen.getByRole('img', { name: /Doncella/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Ama de llaves/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Jardinero/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Mayordomo/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Conde' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Condesa/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Drácula/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Fantasma/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Frankenstein/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Momia/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Hombre Lobo/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Dr. Jekyll/ })).toBeInTheDocument();

  });

  it('Realiza la sospecha correctamente', async () => {
    render(
      <Sospechar
        idPlayer={idPlayer}
        idPartida={idPartida}
        suspecting
        setHasError={() => {}}
      />
    );

    await act(async () => {
      userEvent.click(await screen.findByRole('button', { name: /Sospechar/ }));
      userEvent.click(screen.getByRole('img', { name: card1Name }));
      userEvent.click(screen.getByRole('img', { name: card2Name }));
      userEvent.click(await screen.findByRole('button', { name: /Sospechar/ }));
    });
    const recibido = localStorage.getItem("postRecibido")
    expect(recibido).toBe("true");
  });
  it('Maneja caso de error', async () => {
    server.use(
      rest.post(urlServer, (req, res, ctx) => {
        return res(
          ctx.status(403),
        );
      }),
    );
    const mockHasError = jest.fn();

    render(
      <Sospechar
        idPlayer={idPlayer}
        idPartida={idPartida}
        suspecting
        setHasError={() => mockHasError()}
      />
    );

    await act(async () => {
      userEvent.click(await screen.findByRole('button', { name: /Sospechar/ }));
      userEvent.click(screen.getByRole('img', { name: card1Name }));
      userEvent.click(screen.getByRole('img', { name: card2Name }));
      userEvent.click(await screen.findByRole('button', { name: /Sospechar/ }));
    });
    expect(mockHasError).toBeCalledTimes(1);
  });
});
