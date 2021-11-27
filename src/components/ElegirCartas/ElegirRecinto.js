import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Card from '../Carta';
import { roomsNames } from '../../utils/constants';
import '../Partida.css';

function ElegirRecinto(props) {
  const { recinto, setRecinto } = props;
  const [newSelected, setNewSelected] = useState('');

  function handleClick(id) {
    setNewSelected(id);
    const img = document.getElementById(id);
    img.className = 'selectedCard';
  }

  useEffect(() => {
    if (recinto !== newSelected && recinto === '') {
      setRecinto(newSelected);
    } else if (recinto !== newSelected && recinto !== '') {
      document.getElementById(recinto).className = 'optionCard';
      setRecinto(newSelected);
    }
  }, [newSelected, recinto, setRecinto]);

  const roomsCards = [];
  for (const key in roomsNames) {
    if (!roomsNames.hasOwnProperty(key)) continue;
    const id = key;
    roomsCards.push(
      <Card
        id={id}
        key={id}
        cardName={roomsNames[key]}
        onClick={() => handleClick(id)}
      />,
    );
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {roomsCards}
    </Stack>
  );
}

export default ElegirRecinto;
