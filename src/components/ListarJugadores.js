import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import { ListItem, ListItemText } from '@mui/material';

async function getPlayers(idPartida, idPlayer) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const endpoint = process.env.REACT_APP_URL_SERVER.concat(
    '/', idPartida, '?gameId=', idPartida, '&playerId=', idPlayer,
  );
  const data = fetch(endpoint, requestOptions)
    .then(async (response) => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const payload = isJson && await response.json();
      if (!response.ok) {
        const error = (payload && payload.Error) || response.status;
        return Promise.reject(error);
      }
      return payload;
    })
    .catch((error) => Promise.reject(error));
  return data;
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
            setRows(response?.players);
            setNPlayers(response?.players.length);
            setPlayerJoined(false);
          })
          .catch((error) => {
            console.error('Oops something went wrong..', error);
          });
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
