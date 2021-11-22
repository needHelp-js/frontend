import React from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, unmountComponentAtNode } from 'react-dom';
import TerminarTurno from '../components/TerminarTurno';
import * as fetchHandler from '../utils/fetchHandler';

const endpointTerminarTurno = `${process.env.REACT_APP_URL_SERVER}/terminarTurno`;
const endpointTerminarTurnoFail = `${process.env.REACT_APP_URL_SERVER}/terminarTurnoFail`;
const server = setupServer(
  rest.post(endpointTerminarTurno, (req, res, ctx) => res(
    ctx.status(204),
  )),
  rest.post(endpointTerminarTurnoFail, (req, res, ctx) => res(
    ctx.status(403),
    ctx.json({ Error: 'No es el turno del jugador' }),
  )),
);

beforeAll(() => server.listen());

let container = null;
beforeEach(() => {
  server.restoreHandlers();
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

afterAll(() => server.close());

describe('TerminarTurno', () => {
  it('Renderiza el componente TerminarTurno', () => {
    act(() => {
      render(<TerminarTurno />, container);
    });
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('Cambia el turno del jugador', async () => {
    await act(async () => {
      render(<TerminarTurno endpoint={endpointTerminarTurno} />, container);
    });

    const spy = jest.spyOn(fetchHandler, 'fetchRequest');

    const terminarTurnoButton = container.firstChild.firstChild;
    userEvent.click(terminarTurnoButton);

    const requestOptions = {
      method: 'POST',
    };

    expect(spy).toBeCalledWith(endpointTerminarTurno, requestOptions);
    spy.mockRestore();
  });

  it('Fail. No es el turno del jugador', async () => {
    await act(async () => {
      render(<TerminarTurno endpoint={endpointTerminarTurnoFail} />, container);
    });
    const terminarTurnoButton = container.firstChild.firstChild;
    userEvent.click(terminarTurnoButton);
    expect(await screen.findByText(/No es el turno del jugador/)).toBeInTheDocument();
  });
});
