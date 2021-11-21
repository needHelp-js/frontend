import React from 'react';
import WS from 'jest-websocket-mock';
import { render, unmountComponentAtNode } from 'react-dom';
import Partida from '../components/Partida';
import SocketSingleton from '../components/connectionSocket';
import { act } from 'react-dom/test-utils';
import { monstersNames, roomsNames, victimsNames } from '../utils/constants';

const urlWebsocket = `${process.env.REACT_APP_URL_WS}/1/ws/1`;
const wsServer = new WS(urlWebsocket);

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  SocketSingleton.init(new WebSocket(urlWebsocket));
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  SocketSingleton.destroy();
});

describe('Partida', () => {
    it('renderiza el componente con las cartas', async () => {
        act(() => {
            render(<Partida />, container);
        });
        await wsServer.connected

        const cardNames = [victimsNames.AMA_DE_LLAVES, monstersNames.DRACULA, roomsNames.ALCOBA];

        act(() => {
            wsServer.send(JSON.stringify({
                type: 'DEAL_CARDS_EVENT',
                payload: cardNames
            }));
        });

    const cardElems = container.firstChild.firstChild.children;

    let idx = 0;
    for (const cardElem of cardElems) {
        let imageElem = cardElem.firstChild;
        let elem = cardNames[idx];

        expect(imageElem.alt).toBe(elem);
        idx++;
    }
    });
});

