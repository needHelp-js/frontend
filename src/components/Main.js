import React from 'react';
import Button from '@mui/material/Button';
import './Main.css';
import { Link } from 'react-router-dom';
import {URL_LISTAR_PARTIDAS, URL_CREAR_PARTIDA} from '../routes.js';
import Typography from '@mui/material/Typography';

const BotonOpcionListarPartidas = () => (
  <div className="botonOpcionListarPartida">
    <Link 
        style={{textDecoration:"none"}}
        to={URL_LISTAR_PARTIDAS}>
    <Button
      variant="contained"
    >
      Listar Partidas
    </Button>
    </Link>
  </div>
);

const BotonOpcionCrearPartida = () => (
  <div className="botonOpcionCrearPartida">
    <Link 
        style ={{textDecoration:"none"}}
        to={URL_CREAR_PARTIDA}>
    <Button
      variant="contained"
    >
      Crear una partida
    </Button>
    </Link>
  </div>
);

function Main() {
  return (
    <div>
       <Typography align="center" variant="h1">
        Misterio
      </Typography>

      <BotonOpcionListarPartidas />
      <BotonOpcionCrearPartida />
    </div>
  );
}

export default Main;
