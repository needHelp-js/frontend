import React, { useEffect, useState } from "react";
import Stack from '@mui/material/Stack'
import './Partida.css'
import amaDeLlaves from '../Misterio_cartas/ama_de_llaves.png'
import doncella from '../Misterio_cartas/doncella.png'
import jardinero from '../Misterio_cartas/jardinero.png'
import mayordomo from '../Misterio_cartas/mayordomo.png'
import conde from '../Misterio_cartas/conde.png'
import condesa from '../Misterio_cartas/condesa.png'

function Elegirvictimaa(props){
  const { victima, setVictima } = props;
  const [newSelected, setNewSelected] = useState('');

  function handleClick(id){
    console.log('vamos a sospechar',id);
    setNewSelected(id);
    const img = document.getElementById(id);
    img.className = "selectedCard";
  }

  useEffect(() => {
    if(victima != newSelected && victima == ''){
      setVictima(newSelected);
    }else if(victima != newSelected && victima != ''){
      document.getElementById(victima).className = "optionCard";
      setVictima(newSelected);
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
      <img 
      id="jardinero"
      className="optionCard"
      src={jardinero}
      alt={'jardinero'}
      onClick={() => {handleClick("jardinero")}} 
      />
      <img 
      id="mayordomo"
      className="optionCard"
      src={mayordomo}
      alt={'mayordomo'}
      onClick={() => {handleClick("mayordomo")}} 
      />
      <img 
      id="conde"
      className="optionCard"
      src={conde}
      alt={'conde'}
      onClick={() => {handleClick("conde")}} 
      />
      <img 
      id="condesa"
      className="optionCard"
      src={condesa}
      alt={'condesa'}
      onClick={() => {handleClick("condesa")}} 
      />
    </Stack>
  );
}

export default Elegirvictimaa;