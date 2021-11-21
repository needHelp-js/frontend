import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import WS from 'jest-websocket-mock';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Index from '../components/Index';
import SocketSingleton from '../components/connectionSocket';

const idPartida = 1;
const idPlayer = 1;
const nombrePartida = 'nombreDeLaPartida';
const card1Name = 'Jardinero';
const card2Name = 'Momia';

const history = createMemoryHistory();

const state = {
  idPartida,
  idPlayer,
};

const suspicionPayload = {
  type: 'SUSPICION_MADE_EVENT',
  payload: {
    playerId: idPlayer,
    card1Name,
    card2Name,
    roomName: nombrePartida,
  },
};

const urlWebsocket = `${process.env.REACT_APP_URL_WS}/${idPartida}/ws/${idPlayer}`;
const wsServer = new WS(urlWebsocket);

const urlServer = `${process.env.REACT_APP_URL_SERVER}/${idPartida}/suspect/${idPlayer}`;
const server = setupServer(
  rest.post(urlServer, (req, res, ctx) => {
    localStorage.setItem('postRecibido',true);
    wsServer.send(JSON.stringify(suspicionPayload));
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
    SocketSingleton.init(new WebSocket(urlWebsocket));
    history.push('/partida', state);
    render(
      <Router history={history}>
        <Index />
      </Router>,
    );

    await wsServer.connected;
    userEvent.click(await screen.findByRole('button', { name: /Sospechar/ }));
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

    SocketSingleton.destroy();
  });

  it('Realiza la sospecha correctamente', async () => {
    SocketSingleton.init(new WebSocket(urlWebsocket));

    history.push('/partida', state);
    render(
      <Router history={history}>
        <Index />
      </Router>,
    );

    await wsServer.connected;
    await act(async () => {
      userEvent.click(await screen.findByRole('button', { name: /Sospechar/ }));
      userEvent.click(screen.getByRole('img', { name: card1Name }));
      userEvent.click(screen.getByRole('img', { name: card2Name }));
      userEvent.click(await screen.findByRole('button', { name: /Sospechar/ }));
    });
    const recibido = localStorage.getItem("postRecibido")
    expect(recibido).toBe("true");
    //expect(await screen.findByText(/Se sospecho por/)).toBeInTheDocument();
    SocketSingleton.destroy();
  });
});
