import { render, screen} from '@testing-library/react';
import RespuestaDado from '../components/RespuestaDado';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import React from 'react';


const server = setupServer(

  rest.get(process.env.REACT_APP_URL_SERVER.concat('/1/dice/1'), (req, res, ctx) => {
      return res(ctx.status(204))
  }),

  rest.get('/conectionFail', (req, res, ctx) => {
      return res(
          ctx.status(500),
          ctx.json([{'Error' : 'No hay conexion'}])
          )

  })

)


beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


test('1. Caso de éxito: Es el turno del jugador', async () => {
    
    render(
        <RespuestaDado DadoUrl={process.env.REACT_APP_URL_SERVER.concat('/1/dice/1')}/>
    )
    const button = await screen.getByRole('button');
    expect(button).toBeInTheDocument();
  

});
