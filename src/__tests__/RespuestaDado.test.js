import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import WS from 'jest-websocket-mock';
import RespuestaDado from '../components/RespuestaDado';
import SocketSingleton from '../components/connectionSocket';

const server = setupServer(

  rest.get(process.env.REACT_APP_URL_SERVER.concat('/1/dice/1'), (req, res, ctx) => res(ctx.status(204))),
);

const urlWebsocket = process.env.REACT_APP_URL_WS.concat('/1/ws/1');
const wsServer = new WS(urlWebsocket);
wsServer.on('connection', (socket) => {
  socket.send(JSON.stringify({
    type: 'DICE_ROLL_EVENT',
    payload: {
      ans: 1,
    },
  }));
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('1. Caso de éxito: Es el turno del jugador', async () => {
  SocketSingleton.init(new WebSocket(urlWebsocket));

  render(
    <RespuestaDado DadoUrl={process.env.REACT_APP_URL_SERVER.concat('/1/dice/1')} />,
  );

  await wsServer.connected;

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
});
