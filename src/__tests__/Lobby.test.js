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
import { SocketSingleton } from '../components/connectionSocket';

let idPartida = 1;
let idPlayer = 1;
let idPlayer2 = 2;
const nombrePartida = 'nombreDeLaPartida';
const nicknamePlayer = 'nicknameDelJugador';
const nicknamePlayer2 = 'nicknameDelJugador2';

const history = createMemoryHistory();
const state = {
  idPartida,
  idPlayer,
  nombrePartida,
  isHost: true,
};
history.push('/lobby', state);

const urlWebsocket = process.env.REACT_APP_URL_WS.concat('/',idPartida, '/ws/', idPlayer);
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
const urlServer = process.env.REACT_APP_URL_SERVER;
const server = setupServer(
  rest.get(urlServer.concat('/', idPartida), (req, res, ctx) => res(
    ctx.status(200),
    ctx.json(players),
  )),
  rest.patch(urlServer.concat('/', idPartida, '/begin/', idPlayer), (req, res, ctx) => {
    wsServer.send(JSON.stringify({
      type: 'BEGIN_GAME_EVENT',
    }));
    sessionStorage.setItem('empezoPartida',true);
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
    SocketSingleton.destroy();
  });

  it('Actualiza lista de jugadores', async () => {
    render(
      <Router history={history}>
        <Index />
      </Router>,
    );

    expect(await screen.findByText(nicknamePlayer)).toBeInTheDocument();

    server.use(
      rest.get(urlServer.concat('/', idPartida), (req, res, ctx) => res(
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
    SocketSingleton.destroy();
  });

  it('Inicia la partida correctamente', async () => {
    server.use(
      rest.get(urlServer.concat('/', idPartida), (req, res, ctx) => res(
        ctx.status(200),
        ctx.json(players2),
        )),
    );
    
    render(
      <Router history={history}>
        <Index />
      </Router>,
    );

    await wsServer.connected;
    expect(await screen.findByText(nicknamePlayer)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    const comienzo = sessionStorage.getItem('empezoPartida');
    expect(comienzo).toBe('true');
    sessionStorage.setItem('empezoPartida', false)
  });

  it('No permite iniciar la partida si no hay suficientes jugadores', async () => {
    idPartida = 3;
    idPlayer = 3;
    const history2 = createMemoryHistory();
    const state2 = {
      idPartida,
      idPlayer,
      nombrePartida,
      isHost: true,
    };
    history2.push('/lobby', state2);

    server.use(
      rest.patch(urlServer.concat('/', idPartida, '/begin/', idPlayer), (req, res, ctx) => res(
          ctx.status(403), 
          ctx.json({Error: 'No hay suficientes jugadores para empezar la partida'})
        )
      ),
      rest.get(urlServer.concat('/', idPartida), (req, res, ctx) => res(
        ctx.status(200),
        ctx.json(players2),
        )),
      );

    render(
      <Router history={history2}>
        <Index />
      </Router>,
    );

    await wsServer.connected;
    await userEvent.click(screen.getByRole('button'));
    const comienzo = sessionStorage.getItem('empezoPartida');
    expect(comienzo).not.toBe('true');
  });
});
