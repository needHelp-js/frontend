import React from "react";
import { useState } from "react";
import ListarPartidas from "./ListarPartidas";
import Button from '@mui/material/Button';
import './Opciones.css';

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


function OpcionListarPartidas () {
    const [listando, setListando] = useState(false);
    const PARTIDAS_URL = 'http://192.168.0.152:81/partidas';
    if(listando){
        return (
            <ListarPartidas url={PARTIDAS_URL}/>
        );
    }else{
        return(
            <BotonOpcionListarPartidas setListando={() => setListando(true)}/>
        );
    }

};

export default OpcionListarPartidas