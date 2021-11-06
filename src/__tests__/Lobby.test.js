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

const idPartida = 1;
const idPlayer = 1;
const idPlayer2 = 2;
const nombrePartida = 'nombreDeLaPartida';
const nicknamePlayer = 'nicknameDelJugador';
const nicknamePlayer2 = 'nicknameDelJugador2';

const history = createMemoryHistory();
const state = {
  idPartida,
  idPlayer,
  nombrePartida,
  nicknamePlayer,
  isHost: true,
};
history.push('/lobby', state);

const urlWebsocket = 'ws://localhost:8000/games/'.concat(idPartida, '/ws/', idPlayer);
const wsServer = new WS(urlWebsocket);
wsServer.on('connection', (socket) => {
  socket.send(JSON.stringify({
    type: 'PLAYER_JOINED_EVENT',
    payload: {
      playerId: idPlayer,
      playerNickname: nicknamePlayer,
    },
  }));
});

const players = {
  players: [{ id: idPlayer, nickname: nicknamePlayer }],
};
const players2 = {
  players: [
    { id: idPlayer, nickname: nicknamePlayer },
    { id: idPlayer2, nickname: nicknamePlayer2 },
  ],
};
const urlServer = 'http://localhost:8000/games/';
const server = setupServer(
  rest.get(urlServer.concat(idPartida), (req, res, ctx) => res(
    ctx.status(200),
    ctx.json(players),
  )),
  rest.patch(urlServer.concat(idPartida, '/begin/', idPlayer), (req, res, ctx) => {
    wsServer.send(JSON.stringify({
      type: 'BEGIN_GAME_EVENT',
    }));
    return res(ctx.status(200));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Lobby', () => {
  it('Renderiza el componente y crea un websocket', async () => {
    render(
      <Router history={history}>
        <Index />
      </Router>,
    );

    await wsServer.connected;

    expect(screen.getByText(nombrePartida)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer)).toBeInTheDocument();
  });

  it('Actualiza lista de jugadores', async () => {
    render(
      <Router history={history}>
        <Index />
      </Router>,
    );

    expect(await screen.findByText(nicknamePlayer)).toBeInTheDocument();

    server.use(
      rest.get(urlServer.concat(idPartida), (req, res, ctx) => res(
        ctx.status(200),
        ctx.json(players2),
      )),
    );

    act(() => {
      wsServer.send(JSON.stringify({
        type: 'PLAYER_JOINED_EVENT',
      }));
    });
    expect(await screen.findByText(nicknamePlayer)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer2)).toBeInTheDocument();
  });

  it('Inicia la partida correctamente', async () => {
    render(
      <Router history={history}>
        <Index />
      </Router>,
    );

    await wsServer.connected;
    act(() => { userEvent.click(screen.getByRole('button')); });
    expect(await screen.findByText(/Bienvenido/)).toBeInTheDocument();
  });
});
