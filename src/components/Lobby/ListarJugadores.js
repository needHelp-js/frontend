import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import { ListItem, ListItemText } from '@mui/material';
import { fetchRequest, fetchHandlerError } from '../../utils/fetchHandler';

async function getPlayers(idPartida, idPlayer) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const params = {
    playerId: idPlayer,
  }
  return fetchRequest(
    `${process.env.REACT_APP_URL_SERVER}/${idPartida}`,
    requestOptions, 
    params
  );
}

function mostrarJugadores(rows) {
  let res = [];
  if (rows) {
    if (rows.length > 0) {
      res = rows.map((row) => (
        <ListItem key={row.id}>
          <ListItemText primary={row.nickname} />
        </ListItem>
      ));
    }
  }
  return res;
}

function ListarJugadores(props) {
  const [rows, setRows] = useState([]);
  const {
    playerJoined, setPlayerJoined, setNPlayers, idPartida, idPlayer,
  } = props;

  useEffect(() => {
    let isMounted = true;
    async function updatePlayers() {
      if (playerJoined && isMounted) {
        getPlayers(idPartida, idPlayer)
          .then(async (response) => {
            if (response.type === fetchHandlerError.SUCCESS){
              if(isMounted){
                setRows(response?.payload.players);
                setNPlayers(response?.payload.players.length);
                setPlayerJoined(false);
              }
            }
          })
      }
    }
    updatePlayers();
    return () => {
      isMounted = false;
    };
  }, [playerJoined, idPartida, setPlayerJoined]);

  return (
    <List>
      {mostrarJugadores(rows)}
    </List>
  );
}

export default ListarJugadores;
