import 'whatwg-fetch';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ListarPartidas from './ListarPartidas.js';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {useEffect } from 'react';
import userEvent from '@testing-library/user-event';

const MOCK_GET = [
        {'name': 'los pibis', 'playerCount': 3}, 
        {'name': 'boquita', 'playerCount': 5}, 
        {'name': 'piolas', 'playerCount': 2}
];

const server = setupServer(
        rest.get('/partidas', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(MOCK_GET))
        }), 

        rest.get('/vacia', (req, res, ctx) => {
            return res(ctx.json([]))
        }),
        rest.get('/apagado', (req, res, ctx) => {
            return res(ctx.status(500))
        })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

    
const titles = ['Nombre de la partida', 
    'Jugadores dentro',
    'Actualizar', 
    'Sin conexión, actualice la lista'
]; 

const names = MOCK_GET.map(obj => obj['name']);
const playersCount = MOCK_GET.map(obj => obj['playerCount']);

test('1. Caso de exito: hay conexión y al menos una partida', async () => {
    render(<ListarPartidas url='/partidas' />);
    const button = await screen.getByRole('button');
    await userEvent.click(button); 
        

    for (var i = 0; i < names.length; i++){
        const name = await screen.findByText(names[i]);
        const count = await screen.findByText(playersCount[i]);
        expect(name).toBeInTheDocument();
        expect(count).toBeInTheDocument();
    }

});


test('2. Caso de excepción: no hay conexión.', async () => {
    render(<ListarPartidas url='/apagado' />);
    const actualizar = await screen.getByRole('button'); 
    await userEvent.click(actualizar);
    const mgs = await screen.findByText('Sin conexión, actualice la lista.');
});

test('3. Caso de excepción: hay conexión pero no hay partidas.', async () => {
    render(<ListarPartidas url='vacia'/>);
    const button = await screen.getByRole('button');
    await userEvent.click(button);
    const msg = await screen.findByText('No hay partidas.');
    expect(msg).toBeInTheDocument();

});
    
