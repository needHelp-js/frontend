import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import ElegirNickname from '../components/ElegirNickname';
import ElegirNombrePartida from '../components/ElegirNombrePartida';
import CrearPartida from '../components/CrearPartida';

const server = setupServer(
  rest.post('/createGame', (req, res, ctx) => {
    sessionStorage.setItem('post-recibido', true);
      return res(
          ctx.status(200),
      )
  }),
  rest.post('/createGameFail', (req, res, ctx) => {
      return res(
          ctx.status(400),
          ctx.json([{'Error' : 'Partida p ya existe'}])
      )
  }),

);

const nombrePartida = 'UnNombreParaLaPartida';
const nickname = 'UnNombreParaElJugador';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe ('ElegirNombrePartida', () => {
  it('Renderiza el componente ElegirNombrePartida', () =>{
    render(<ElegirNombrePartida />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de la Partida/)).toBeInTheDocument();
  });

  it('Actualiza el nombre de la partida', () =>{
    const setNombrePartida = jest.fn();

    render(<ElegirNombrePartida setNombrePartida={setNombrePartida}/>);
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

  it('Actualiza el nickname', () =>{
    const setNickName = jest.fn();

    render(<ElegirNickname setNickName={setNickName}/>);
    userEvent.type(screen.getByLabelText(/Nickname/), nickname);
    expect(setNickName).toHaveBeenCalledTimes(nickname.length);

  });
});

describe('CrearPartida', () => {
  it('Renderiza la interfaz para ingresar datos de la partida', () => {
    render(<CrearPartida />)
    expect(screen.getAllByRole('textbox')[0]).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')[1]).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de la Partida/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nickname/)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('Hace el POST al backend', async () => {
    render(<CrearPartida endpoint='/createGame'/>)
    await userEvent.type(screen.getByLabelText(/Nombre de la Partida/), nombrePartida);
    await userEvent.type(screen.getByLabelText(/Nickname/), nickname);
    await userEvent.click(screen.getByRole('button'));
    const recibido = sessionStorage.getItem('post-recibido');
    expect(recibido).toBe('true');
  });

  it('Maneja un error en el POST', async () => {
    render(<CrearPartida endpoint='/createGameFail'/>)
    await userEvent.type(screen.getByLabelText(/Nombre de la Partida/), 'UnNombreParaLaPartida');
    await userEvent.type(screen.getByLabelText(/Nickname/), 'UnNombreParaElJugador');
    await userEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/recargue/)).toBeInTheDocument();

  });

});
