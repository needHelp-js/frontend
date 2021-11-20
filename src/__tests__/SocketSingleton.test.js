import React from 'react';
import { render, screen } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import {SocketSingleton, SingletonAlreadyInitialized} from '../../src/components/connectionSocket';



describe('Test del socket', () => {
  it('Crea una instancia correctamente', () => {
    const idPartida = 1;
    const idPlayer = 1;
    const urlWebsocket = process.env.REACT_APP_URL_WS.concat('/', idPartida, '/ws/', idPlayer);
    SocketSingleton.init(new WS(urlWebsocket));
    const socket = SocketSingleton.getInstance();
    expect(socket).not.toBeNull();
  });
  it('Es singleton', () => {
    const idPartida = 2;
    const idPlayer = 2;
    const urlWebsocket = process.env.REACT_APP_URL_WS.concat('/', idPartida, '/ws/', idPlayer);
    expect(() => SocketSingleton.init(new WS(urlWebsocket))).toThrow(SingletonAlreadyInitialized);
  });
  it('Devuelve la misma instancia', () => {
    const instance1 = SocketSingleton.getInstance();
    const instance2 = SocketSingleton.getInstance();
    expect(instance2).toBe(instance1);
  });
  it('Destruye la instancia con el metodo correspondiente', () => {
    const instance = SocketSingleton.getInstance();
    expect(instance).not.toBe(null);
    SocketSingleton.destroy();
    const instance2 = SocketSingleton.getInstance();
    expect(instance2).toBe(null);
  });
});
