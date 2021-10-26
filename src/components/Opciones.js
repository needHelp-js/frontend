import React from "react";
import { useState } from "react";
import ListarPartidas from "./ListarPartidas";
import Button from '@mui/material/Button';
import './Opciones.css';
import CrearPartida from "./CrearPartida";

const BotonOpcionListarPartidas = ({ setListando }) => (
    <div className="botonOpcionListarPartida">
      <Button
        variant="contained"
        onClick={setListando}
      >
        Listar Partidas
      </Button>
    </div>
  );

const BotonOpcionCrearPartida = ({ setCreando }) => (
    <div className="botonOpcionCrearPartida">
        <Button
        variant="contained"
        onClick={setCreando}
        >
        Crear una partida
        </Button>
    </div>
);


function Opciones () {
    const [listando, setListando] = useState(false);
    const [creando, setCreando] = useState(false);
    const PARTIDAS_URL = 'http://192.168.0.152:81/partidas';
    if(listando){
        return (
            <ListarPartidas url={PARTIDAS_URL}/>
        );
    }else if(creando){
        return(
            <CrearPartida endpoint={PARTIDAS_URL} />

        );
    }else{
        return(
            <div>
                <BotonOpcionListarPartidas setListando={() => setListando(true)}/>
                <BotonOpcionCrearPartida setCreando={() => setCreando(true)} />
            </div>
            );
    }
};

export default Opciones