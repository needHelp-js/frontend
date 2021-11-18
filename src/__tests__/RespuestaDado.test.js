import { render, screen} from '@testing-library/react';
import RespuestaDado from '../components/RespuestaDado';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import WS from 'jest-websocket-mock';
import Index from '../components/Index'
import {SocketSingleton} from '../components/connectionSocket'





const MOCK_GET = [
  {'type' : 'DICE_ROLL_EVENT', 'payload' : 1},
  {'type' : 'DICE_ROLL_EVENT', 'payload' : 2},
  {'type' : 'DICE_ROLL_EVENT', 'payload' : 3},
  {'type' : 'DICE_ROLL_EVENT', 'payload' : 4},
  {'type' : 'DICE_ROLL_EVENT', 'payload' : 5},
  {'type' : 'DICE_ROLL_EVENT', 'payload' : 6}
];


const server = setupServer(

  rest.get('/rollDice', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(MOCK_GET))
  }),

  rest.get('/conectionFail', (req, res, ctx) => {
      return res(
          ctx.status(500),
          ctx.json([{'Error' : 'No hay conexion'}])
          )

  })

)

const urlWebsocket = process.env.REACT_APP_URL_WS.concat('/1/ws/1');
const wsServer = new WS(urlWebsocket);
wsServer.on('connection', (socket) => {
  socket.send(JSON.stringify({
    type: 'DICE_ROLL_EVENT',
    payload: {
      ans : 1,
    },
  }));
});

SocketSingleton.init(wsServer); 

const history = createMemoryHistory();
const state = {
  wsServer,
  url : '/rollDice',
};
history.push('/partida', state);


beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


const number = MOCK_GET.map(obj => obj['number']);


test('1. Caso de éxito: Es el turno del jugador', async () => {


  render(
      <Router history={history}>
        <Index />
      </Router>,
    );

  await wsServer.connected;

  const button = await screen.getByRole('button');
  await userEvent.click(button);


  for (var i = 0; i <= 6; i++){
      const num = await screen.findByText(number[i])
      expect(num).toBeInTheDocument();
  }

});


test('2. Caso de excepción: Interrupción de la conexión.', async () => {

    render(
        <Router history={history}>
          <Index />
        </Router>,
      );

    await wsServer.connected;

    const actualizar = await screen.getByRole('button');
    global.alert = jest.fn();
    await userEvent.click(actualizar);
    expect(global.alert.mock.calls.length).toBe(1);
});