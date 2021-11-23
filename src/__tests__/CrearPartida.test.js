import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ElegirNickname from '../components/CrearPartida/ElegirNickname';
import ElegirNombrePartida from '../components/CrearPartida/ElegirNombrePartida';
import CrearPartida from '../components/CrearPartida/CrearPartida';
import * as fetchHandler from '../utils/fetchHandler';

const endpointCreate = `${process.env.REACT_APP_URL_SERVER}/createGame`;
const endpointCreateFail = `${process.env.REACT_APP_URL_SERVER}/createGameFail`;
const server = setupServer(
  rest.post(endpointCreate, (req, res, ctx) => {
    sessionStorage.setItem('post-recibido', true);
    return res(
      ctx.status(200),
    );
  }),
  rest.post(endpointCreateFail, (req, res, ctx) => res(
    ctx.status(400),
    ctx.json({ Error: 'Partida UnNombreParaLaPartida ya existe' }),
  )),

);

const nombrePartida = 'UnNombreParaLaPartida';
const nickname = 'UnNombreParaElJugador';
beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ElegirNombrePartida', () => {
  it('Renderiza el componente ElegirNombrePartida', () => {
    render(<ElegirNombrePartida />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de la Partida/)).toBeInTheDocument();
  });

  it('Actualiza el nombre de la partida', () => {
    const setNombrePartida = jest.fn();

    render(<ElegirNombrePartida setNombrePartida={setNombrePartida} />);
    userEvent.type(screen.getByLabelText(/Nombre de la Partida/), nombrePartida);
    expect(setNombrePartida).toHaveBeenCalledTimes(nombrePartida.length);
  });
});

describe('ElegirNickName', () => {
  it('Renderiza el componente ElegirNickname', () => {
    render(<ElegirNickname />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nickname/)).toBeInTheDocument();
  });

  it('Actualiza el nickname', () => {
    const setNickName = jest.fn();

    render(<ElegirNickname setNickName={setNickName} />);
    userEvent.type(screen.getByLabelText(/Nickname/), nickname);
    expect(setNickName).toHaveBeenCalledTimes(nickname.length);
  });
});

describe('CrearPartida', () => {
  it('Renderiza la interfaz para ingresar datos de la partida', () => {
    render(<CrearPartida />);
    expect(screen.getAllByRole('textbox')[0]).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')[1]).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de la Partida/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nickname/)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('Hace el POST al backend', async () => {
    render(<CrearPartida endpoint={endpointCreate} />);
    await act(async () => {
      userEvent.type(screen.getByLabelText(/Nombre de la Partida/), nombrePartida);
      userEvent.type(screen.getByLabelText(/Nickname/), nickname);
      userEvent.click(screen.getByRole('button'));
    });
    const recibido = sessionStorage.getItem('post-recibido');
    expect(recibido).toBe('true');
  });

  it('Respuesta al intentar crear una partida que ya existe', async () => {
    render(<CrearPartida endpoint={endpointCreateFail} />);
    await act(async () => {
      userEvent.type(screen.getByLabelText(/Nombre de la Partida/), 'UnNombreParaLaPartida');
      userEvent.type(screen.getByLabelText(/Nickname/), 'UnNombreParaElJugador');
      userEvent.click(screen.getByRole('button'));
    });
    expect(await screen.findByText(/ya existe/)).toBeInTheDocument();
  });

  it('Valida formularios antes de enviarlos', async () => {
    render(<CrearPartida endpoint={endpointCreate} />);
    await act(async () => {
      userEvent.type(screen.getByLabelText(/Nickname/), 'UnNombreParaElJugador');
      userEvent.click(screen.getByRole('button'));
    });
    expect(await screen.findByText(/nombre de la partida debe tener/)).toBeInTheDocument();
    await act(async () => {
      userEvent.type(screen.getByLabelText(/Nombre de la Partida/), 'UnNombreParaLaPartida');
      userEvent.click(screen.getByRole('button'));
    });
    expect(await screen.findByText(/nickname debe tener/)).toBeInTheDocument();
  });

  it('Crea partida con contraseña', async () => {
    await act(async () => {
      render(<CrearPartida endpoint={endpointCreate} />);
    });

    const passwordElem = document.querySelector('#password');

    expect(passwordElem).toBeInTheDocument();

    const spy = jest.spyOn(fetchHandler, 'fetchRequest');

    userEvent.type(screen.getByLabelText(/Nombre de la Partida/), nombrePartida);
    userEvent.type(screen.getByLabelText(/Nickname/), nickname);
    userEvent.type(screen.getByLabelText(/Clave/), '1234');
    userEvent.click(screen.getByRole('button'));

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameName: nombrePartida,
        hostNickname: nickname,
        password: '1234',
      }),
    };
    expect(spy).toBeCalledWith(endpointCreate, requestOptions);
    spy.mockRestore();
  });
});
