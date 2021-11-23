import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Card from '../Carta';
import { victimsNames } from '../../utils/constants';
import '../Partida.css';

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
  }, [newSelected, victima, setVictima]);

  const victimsCards = [];
  for (const key in victimsNames) {
    if (!victimsNames.hasOwnProperty(key)) continue;
    const id = key;
    victimsCards.push(
      <Card
        id={id}
        key={id}
        cardName={victimsNames[key]}
        onClick={() => handleClick(id)}
      />,
    );
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {victimsCards}
    </Stack>
  );
}

export default Elegirvictima;
