import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import dracula from '../../Misterio_cartas/dracula.png';
import fantasma from '../../Misterio_cartas/fantasma.png';
import frankenstein from '../../Misterio_cartas/frankenstein.png';
import hombreLobo from '../../Misterio_cartas/hombre_lobo.png';
import jekyllHyde from '../../Misterio_cartas/Jekyll_hyde.png';
import momia from '../../Misterio_cartas/momia.png';
import '../Partida.css';

function ElegirMonstruo(props) {
  const { monstruo, setMonstruo } = props;
  const [newSelected, setNewSelected] = useState('');

  function handleClick(id) {
    setNewSelected(id);
    const img = document.getElementById(id);
    img.className = 'selectedCard';
  }

  useEffect(() => {
    if (monstruo !== newSelected && monstruo === '') {
      setMonstruo(newSelected);
    } else if (monstruo !== newSelected && monstruo !== '') {
      document.getElementById(monstruo).className = 'optionCard';
      setMonstruo(newSelected);
    }
  }, [newSelected]);

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <img
        id="Drácula"
        className="optionCard"
        src={dracula}
        alt="Drácula"
        onClick={() => { handleClick('Drácula'); }}
      />
      <img
        id="Fantasma"
        className="optionCard"
        src={fantasma}
        alt="Fantasma"
        onClick={() => { handleClick('Fantasma'); }}
      />
      <img
        id="Frankenstein"
        className="optionCard"
        src={frankenstein}
        alt="Frankenstein"
        onClick={() => { handleClick('Frankenstein'); }}
      />
      <img
        id="Momia"
        className="optionCard"
        src={momia}
        alt="Momia"
        onClick={() => { handleClick('Momia'); }}
      />
      <img
        id="Hombre Lobo"
        className="optionCard"
        src={hombreLobo}
        alt="Hombre Lobo"
        onClick={() => { handleClick('Hombre Lobo'); }}
      />
      <img
        id="Dr. Jekyll Mr Hyde"
        className="optionCard"
        src={jekyllHyde}
        alt="Dr. Jekyll Mr Hyde"
        onClick={() => { handleClick('Dr. Jekyll Mr Hyde'); }}
      />
    </Stack>
  );
}

export default ElegirMonstruo;
