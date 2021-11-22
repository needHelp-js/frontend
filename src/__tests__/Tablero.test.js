import 'whatwg-fetch';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ListarPartidas from '../components/ListarPartidas';
import {rest} from 'msw';
import Tablero from '../components/Tablero';
import 'jest-canvas-mock';



test('1. Caso de exito: hay conexión y al menos una partida',() => {
    render(<Tablero />);
});



 
