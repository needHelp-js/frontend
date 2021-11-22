import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import TerminarTurno from '../components/TerminarTurno';
import * as fetchHandler from '../utils/fetchHandler';

const endpointTerminarTurno = `${process.env.REACT_APP_URL_SERVER}/terminarTurno`;
const endpointTerminarTurnoFail = `${process.env.REACT_APP_URL_SERVER}/terminarTurnoFail`;
const server = setupServer(
    rest.post(endpointTerminarTurno, (req, res, ctx) => {
        sessionStorage.setItem('post-recibido', true);
        return res(
            ctx.status(204), 
            ctx.json({})
        );
    }),
    rest.post(endpointTerminarTurnoFail, (req, res, ctx) => res(
        ctx.status(403),
        ctx.json({Error: "No es el turno del jugador"}),
    )),

);

beforeAll(() => server.listen());
beforeEach(() => server.restoreHandlers());
afterAll(() => server.close());

describe('TerminarTurno', () => {
    it('Renderiza el componente TerminarTurno', () => {
        render(<TerminarTurno />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('Cambia el turno del jugador', async () => {
        await act(async () => {
            render(<TerminarTurno endpoint={endpointTerminarTurno} />);
        });

        const spy = jest.spyOn(fetchHandler, 'fetchRequest');

        await act(async () => {
            userEvent.click(screen.getByRole('button'));
        });

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          };
          expect(spy).toBeCalledWith(endpointTerminarTurno, requestOptions);
    });

    it('Fail. No es el turno del jugador', async () => {
        render(<TerminarTurno endpoint={endpointTerminarTurnoFail} />);
        await act(async () => {
            userEvent.click(screen.getByRole('button'))
        });
        expect(await screen.findByText(/No es el turno del jugador/)).toBeInTheDocument();
    });
});