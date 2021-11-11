import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import dracula from '../Misterio_cartas/dracula.png'
import fantasma from '../Misterio_cartas/fantasma.png'
import frankenstein from '../Misterio_cartas/frankenstein.png'
import hombreLobo from '../Misterio_cartas/hombre_lobo.png'
import jekyllHyde from '../Misterio_cartas/Jekyll_hyde.png'
import momia from '../Misterio_cartas/momia.png'
import './Partida.css';

function ElegirMonstruo(){
  const { monstruo, setMonstruo } = props;
  const [newSelected, setNewSelected] = useState('');

  function handleClick(id){
    console.log('vamos a sospechar',id);
    setNewSelected(id);
    const img = document.getElementById(id);
    img.className = "selectedCard";
  }

  useEffect(() => {
    if(monstruo != newSelected && monstruo == ''){
      setMonstruo(newSelected);
    }else if(monstruo != newSelected && monstruo != ''){
      document.getElementById(monstruo).className = "optionCard";
      setMonstruo(newSelected);
    }

  },[newSelected]);

  return(
    <Stack direction='row' alignItems="center" spacing={2}>
      <img 
      id="dracula"
      className="optionCard"
      src={dracula}
      alt={'dracula'}
      onClick={() => {handleClick("dracula")}} 
      />
      <img 
      id="fantasma"
      className="optionCard"
      src={fantasma}
      alt={'fantasma'}
      onClick={() => {handleClick("fantasma")}} 
      />
      <img 
      id="frankenstein"
      className="optionCard"
      src={frankenstein}
      alt={'frankenstein'}
      onClick={() => {handleClick("frankenstein")}} 
      />
      <img 
      id="momia"
      className="optionCard"
      src={momia}
      alt={'momia'}
      onClick={() => {handleClick("momia")}} 
      />
      <img 
      id="hombreLobo"
      className="optionCard"
      src={hombreLobo}
      alt={'hombreLobo'}
      onClick={() => {handleClick("hombreLobo")}} 
      />
      <img 
      id="jekyllHyde"
      className="optionCard"
      src={jekyllHyde}
      alt={'jekyllHyde'}
      onClick={() => {handleClick("jekyllHyde")}} 
      />
    </Stack>
  );
}

export default ElegirMonstruo;