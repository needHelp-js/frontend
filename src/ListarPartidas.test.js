import React from 'react';
import { render, screen } from '@testing-library/react';
import ListarPartidas from './ListarPartidas.js';
import {rest} from 'msw';
import {setupServer} from 'msw/node';


const MOCK_GET = [
        {"name": "los pibis", "playerCount": 3}, 
        {"name": "boquita", "playerCount": 5}, 
        {"name": "piolas", "playerCount": 2}
];



const server = setupServer(
    rest.get('/partidas', (req, res, ctx) => {
        return res(ctx.json(MOCK_GET))
    }),
    rest.get('/vacia', (req, res, ctx) => {
        return res(ctx.json([]))
    }),
    rest.get('/apagado', (req, res, ctx) => {
        return res(ctx.status(404))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ListarPartidas', () => {
    const titles = ['Nombre de la partida', 
    'Jugadores Dentro',
    'ACTUALIZAR', 
    'Sin conexión, actualice la lista.']

    const names = Object.keys(MOCK_GET);

    test('No hay conexión.', () => {
        render(<ListarPartidas url="/apagado" />);
        for (var i = 0; i < titles.len; i++){
            expect(screen.getByText(names[i])).toBeInTheDocument();
        }
    });
    
    test('Hay conexión y al menos una partida.', () => {
        render(<ListarPartidas url="/partidas" />);
        for (var i = 0; i < names.len; i++){ 
            expect(screen.getByText(names[i])).toBeInTheDocument();
            expect(screen.getByText(MOCK_GET[names[i]])).toBeInTheDocument(); 
        }
    });

    test('Hay conexión y no hay partidas.', () => {
        render(<ListarPartidas url="vacia"/>);
        expect(screen.getByText("No hay partidas.")).toBeInTheDocument();
     });

});


