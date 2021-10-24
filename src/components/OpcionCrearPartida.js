import React, { useState } from 'react';
import Button from '@mui/material/Button';
import './OpcionCrearPartida.css';
import ElegirNombrePartida from './ElegirNombrePartida';
import ElegirNickname from './ElegirNickname';

const BotonOpcionCrearPartida = ({setCreando}) => {

    return(
      <div className="botonOpcionCrearPartida">
          <Button 
          variant="contained" 
          onClick={setCreando}>
            Crear una partida 
          </Button>
      </div>
    );
  }

const OpcionCrearPartida = () =>{

    const [creando, setCreando] = useState(false);
    const [tieneNombrePartida, setTieneNombrePartida] = useState(false);
  
    if(creando){
      if(tieneNombrePartida){
        return(
          <div>
            <ElegirNickname />
          </div>
        )
      }else{
        return (
          <div>
            <ElegirNombrePartida setTieneNombrePartida={() => setTieneNombrePartida(true)}/>
          </div>
        );
      }
    }else{
      return <BotonOpcionCrearPartida setCreando={() => setCreando(true)}/>;
    }
}

export default OpcionCrearPartida