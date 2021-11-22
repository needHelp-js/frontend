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
import RespuestaSospecha from '../components/RespuestaSospecha';
import SocketSingleton  from '../components/connectionSocket';
import { victimsNames,monstersNames } from '../utils/constants';

const idPartida = 1;
const idPlayer = 1;
const nombrePartida = 'nombreDeLaPartida';
const card1Name = "Jardinero"
const card2Name = "Momia"

const history = createMemoryHistory();

const state = {
  idPartida,
  idPlayer
};

const suspicionPayload = {
  type: "SUSPICION_MADE_EVENT",
  payload: {
      playerId: idPlayer,
      card1Name: card1Name,
      card2Name: card2Name,
      roomName: nombrePartida,
  },
};

const urlWebsocket = process.env.REACT_APP_URL_WS.concat('/',idPartida, '/ws/', idPlayer);
const wsServer = new WS(urlWebsocket);

const urlServer = process.env.REACT_APP_URL_SERVER;
const server = setupServer(
  rest.post(urlServer.concat('/', idPartida, '/suspect/', idPlayer), (req, res, ctx) => () => {
    wsServer.send(JSON.stringify(suspicionPayload));
    sessionStorage.setItem('postRecibido', true);
    return res(
      ctx.status(204),
    ) 
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const MOCK_SUSPECTED_CARDS = ['Jardinero', 'Fantasma', 'Cochera'];

describe('Responder Sospecha', () =>{
  it('Renderiza todas las cartas sobre las que hay que responder', async () =>{
    render(
      <RespuestaSospecha 
        suspectedCards={MOCK_SUSPECTED_CARDS}
      />
    );

    expect(screen.getByRole('img', {name: /Jardinero/})).toBeInTheDocument();
    expect(screen.getByRole('img', {name: /Fantasma/})).toBeInTheDocument();
    expect(screen.getByRole('img', {name: /Cochera/})).toBeInTheDocument();

  });

  it('Permite elegir una carta', async () =>{
    render(
      <RespuestaSospecha 
        suspectedCards={MOCK_SUSPECTED_CARDS}
      />
    );

    userEvent.click(await screen.findByRole('img', {name: 'Jardinero'}));
    const jardinero = screen.getByRole('img', {name: /Jardinero/});
    const selectedCard = document.getElementsByClassName('selectedCard')[0];
    expect(jardinero === selectedCard).toBe(true);
    
  });

  it('Permite elegir solo una carta por vez', async () =>{
    render(
      <RespuestaSospecha 
        suspectedCards={MOCK_SUSPECTED_CARDS}
      />
    );

    userEvent.click(await screen.findByRole('img', {name: 'Jardinero'}));
    const jardinero = screen.getByRole('img', {name: /Jardinero/});
    let selectedCard = document.getElementsByClassName('selectedCard')[0];
    expect(jardinero).toBe(selectedCard);
    userEvent.click(await screen.findByRole('img', {name: 'Fantasma'}));
    const fantasma = screen.getByRole('img', {name: /Fantasma/});
    selectedCard = document.getElementsByClassName('selectedCard')[0];
    expect(fantasma).toBe(selectedCard);
    expect(jardinero).not.toBe(selectedCard);
  });

/*   it('Permite elegir solo una carta por vez', async () =>{
    render(
      <RespuestaSospecha 
        suspectedCards={MOCK_SUSPECTED_CARDS}
      />
    );

    
    userEvent.click(await screen.findByRole('img', {name: 'Jardinero'}));
    const jardinero = screen.getByRole('img', {name: /Jardinero/});
    let selectedCard = document.getElementsByClassName('selectedCard')[0];
    expect(jardinero).toBe(selectedCard);
    userEvent.click(await screen.findByRole('img', {name: 'Fantasma'}));
    const fantasma = screen.getByRole('img', {name: /Fantasma/});
    selectedCard = document.getElementsByClassName('selectedCard')[0];
    expect(fantasma).toBe(selectedCard);
    expect(jardinero).not.toBe(selectedCard);
  });
 */
});