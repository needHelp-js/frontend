import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import '../Partida.css';
import amaDeLlaves from '../../Misterio_cartas/ama_de_llaves.png';
import doncella from '../../Misterio_cartas/doncella.png';
import jardinero from '../../Misterio_cartas/jardinero.png';
import mayordomo from '../../Misterio_cartas/mayordomo.png';
import conde from '../../Misterio_cartas/conde.png';
import condesa from '../../Misterio_cartas/condesa.png';

function Elegirvictima(props) {
  const { victima, setVictima } = props;
  const [newSelected, setNewSelected] = useState('');

  function handleClick(id) {
    setNewSelected(id);
    const img = document.getElementById(id);
    img.className = 'selectedCard';
  }

  useEffect(() => {
    if (victima !== newSelected && victima === '') {
      setVictima(newSelected);
    } else if (victima !== newSelected && victima !== '') {
      document.getElementById(victima).className = 'optionCard';
      setVictima(newSelected);
    }
  }, [newSelected]);

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <img
        id="Ama de llaves"
        className="optionCard"
        src={amaDeLlaves}
        alt="Ama de llaves"
        onClick={() => { handleClick('Ama de llaves'); }}
      />
      <img
        id="Doncella"
        className="optionCard"
        src={doncella}
        alt="Doncella"
        onClick={() => { handleClick('Doncella'); }}
      />
      <img
        id="Jardinero"
        className="optionCard"
        src={jardinero}
        alt="Jardinero"
        onClick={() => { handleClick('Jardinero'); }}
      />
      <img
        id="Mayordomo"
        className="optionCard"
        src={mayordomo}
        alt="Mayordomo"
        onClick={() => { handleClick('Mayordomo'); }}
      />
      <img
        id="Conde"
        className="optionCard"
        src={conde}
        alt="Conde"
        onClick={() => { handleClick('Conde'); }}
      />
      <img
        id="Condesa"
        className="optionCard"
        src={condesa}
        alt="Condesa"
        onClick={() => { handleClick('Condesa'); }}
      />
    </Stack>
  );
}

export default Elegirvictima;
