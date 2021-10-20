import React, { useState } from 'react';
import Button from '@mui/material/Button';
import './OpcionCrearPartida.css';
import ElegirNombrePartida from './ElegirNombrePartida';

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
  
    if(creando){
      return (
        <div>
          <ElegirNombrePartida />
        </div>
      );
    }else{
      return <BotonOpcionCrearPartida setCreando={() => setCreando(true)}/>;
    }
}

export default OpcionCrearPartida