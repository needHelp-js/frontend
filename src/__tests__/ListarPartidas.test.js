import 'whatwg-fetch';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ListarPartidas from '../components/ListarPartidas';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {useEffect } from 'react';
import userEvent from '@testing-library/user-event';
import { act } from "react-dom/test-utils";


const urlPartidas = `${process.env.REACT_APP_URL_SERVER}/partidas`
const urlApagado = `${process.env.REACT_APP_URL_SERVER}/apagado`
const urlVacia = `${process.env.REACT_APP_URL_SERVER}/vacia`
const urlJoin1 = `${process.env.REACT_APP_URL_SERVER}/1/join`
const urlJoin2 = `${process.env.REACT_APP_URL_SERVER}/2/join`

const MOCK_GET = [
        {'name': 'los pibis', 'playerCount': 3, 'id': 1}, 
        {'name': 'boquita', 'playerCount': 5, 'id': 2}, 
        {'name': 'piolas', 'playerCount': 2, 'id': 3}
];

const server = setupServer(
        rest.get(urlPartidas, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(MOCK_GET))
        }), 

        rest.get(urlVacia, (req, res, ctx) => {
            return res(ctx.json([]))
        }),
        rest.get(urlApagado, (req, res, ctx) => {
            return res(ctx.status(500))
        }),

        rest.patch(urlJoin1, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({'playerId': 1}))
        }),

        rest.patch(urlJoin2, (req, res, ctx) => {
            return res(ctx.status(403), ctx.json({'Error': 'algún error'}))
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
    render(<ListarPartidas url={urlPartidas} />);
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
    render(<ListarPartidas url={urlApagado} />);
    const actualizar = await screen.getByRole('button'); 
    await userEvent.click(actualizar);
    const mgs = await screen.findByText('Sin conexión, actualice la lista.');
});

test('3. Caso de excepción: hay conexión pero no hay partidas.', async () => {
    render(<ListarPartidas url={urlVacia}/>);
    const button = await screen.getByRole('button');
    await userEvent.click(button);
    const msg = await screen.findByText('No hay partidas.');
    expect(msg).toBeInTheDocument();

});



// Tests unirse a partida.
it('4. Caso de exito: nickname cambia cuando se escribe', async () => {
   await act(async () => {
      render(<ListarPartidas url={urlPartidas}/>);
      const button = screen.getByText('Actualizar');
      await userEvent.click(button);
      const fieldNickName = screen.getByRole('textbox', {name: 'nickname'});
      userEvent.type(fieldNickName, 'usuarioValido');
    });

    expect(screen.getByRole('textbox', {name: 'nickname'})).toHaveValue('usuarioValido');
    let buttons = await screen.findAllByTestId("unirse");
 
    for(let i = 0; i < 3; i++){
      let button = buttons.pop();
      expect(button).not.ToBeDisabled;
    }
});

it('5. Caso de exito: nickname invalido', async () => {
   await act(async () => {
      render(<ListarPartidas url={urlPartidas}/>);
      const button = screen.getByText('Actualizar');
      await userEvent.click(button);
      const fieldNickName = screen.getByRole('textbox', {name: 'nickname'});
      userEvent.type(fieldNickName, 'usuarioN0!Valido');
    });

    let buttons = await screen.findAllByTestId("unirse");
 
    for(let i = 0; i< 3; i++){
      let button = buttons.pop();
      expect(button).ToBeDisabled;
    }
});

it('6. Caso de exito: nickname valido y une a partida que devuelve 200', async () => {
   await act(async () => {
      render(<ListarPartidas url={urlPartidas}/>);
      const button = screen.getByText('Actualizar');
      await userEvent.click(button);
      const fieldNickName = screen.getByRole('textbox', {name: 'nickname'});
      userEvent.type(fieldNickName, 'usuarioValido');
      let buttons =  await screen.findAllByTestId("unirse");
      await userEvent.click(buttons[0]);
   });

});



it('7. Caso de excepción: nickname valido y une a partida que devuelve 403', async () => {
   await act(async () => {
      render(<ListarPartidas url={urlPartidas}/>);
      const button = screen.getByText('Actualizar');
      await userEvent.click(button);
      const fieldNickName = screen.getByRole('textbox', {name: 'nickname'});
      userEvent.type(fieldNickName, 'usuarioValido');
      let buttons =  await screen.findAllByTestId("unirse");
      await userEvent.click(buttons[1]);
   });

});


 
