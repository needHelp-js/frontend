import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import { ListItem, ListItemText } from '@mui/material';

function ordenarJugadores(rows) {
  const myData = rows
    .sort((a,b) => a.turnOrder > b.turnOrder ? 1 : -1)
    .map((player) => (
      
        <ListItem key={player.myData}>
          <ListItemText primary={player.nickname} />
          <ListItemText primary={player.turnOrder}/>
        </ListItem>
      
    ));
  return myData;
}

function MostrarJugadores(props) {
  const {
    playerList,
  } = props;

  return (
    <List>
      {ordenarJugadores(playerList)}
    </List>
  );
}

export default MostrarJugadores;

