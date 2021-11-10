import React, { useEffect, useState } from "react";
import Stack from '@mui/material/Stack'
import './Partida.css'
import amaDeLlaves from '../Misterio_cartas/ama_de_llaves.png'
import doncella from '../Misterio_cartas/doncella.png'
import jardinero from '../Misterio_cartas/jardinero.png'
import mayordomo from '../Misterio_cartas/mayordomo.png'
import conde from '../Misterio_cartas/conde.png'
import condesa from '../Misterio_cartas/condesa.png'

const victimas = [amaDeLlaves, doncella, jardinero, mayordomo, conde, condesa];


function ElegirVictima(){
  const [victim, setVictim] = useState('');
  const [newSelected, setNewSelected] = useState('');

  function handleClick(id){
    console.log('vamos a cambiar',id);
    setNewSelected(id);
    const img = document.getElementById(id);
    img.className = "selectedCard";
  }

  useEffect(() => {
    if(victim != newSelected){
      document.getElementById(newSelected).className = "optionCard";
      setVictim(newSelected);
    }

  },[newSelected]);

  return(
    <Stack direction='row' alignItems="center" spacing={2}>
      <img 
      id="amaDeLlaves"
      className="optionCard"
      src={amaDeLlaves}
      alt={'amaDeLlaves'}
      onClick={() => {handleClick("amaDeLlaves")}} 
      />
      <img 
      id="doncella"
      className="optionCard"
      src={doncella}
      alt={'doncella'}
      onClick={() => {handleClick("doncella")}} 
      />
    </Stack>
  );
}

export default ElegirVictima;