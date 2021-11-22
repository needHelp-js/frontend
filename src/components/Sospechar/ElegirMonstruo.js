import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Card from '../Carta'
import { monstersNames } from '../../utils/constants';
import '../Partida.css';

function ElegirMonstruo(props) {
  const { monstruo, setMonstruo } = props;
  const [newSelected, setNewSelected] = useState('');

  function handleClick(id) {
    console.log('click en', id)
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

  let monstersCards = [];
  for(var key in monstersNames){
    if (!monstersNames.hasOwnProperty(key)) continue;
    const id = monstersNames[key];
      monstersCards.push( 
        <Card
          id={id}
          key={id}
          cardName={id}
          onClick={() => handleClick(id)}
        />
    )
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {monstersCards}
    </Stack>
  );
}

export default ElegirMonstruo;
