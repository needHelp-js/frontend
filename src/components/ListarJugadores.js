import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import { ListItem, ListItemText } from '@mui/material';

async function getPlayers(idPartida) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const endpoint = 'http://0.0.0.0:8000/games/'.concat(idPartida);
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
  console.log('respuesta al get', data);
  return data;
}

function mostrarJugadores(rows) {
  console.log('en la func rows es', rows);
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
  const { playerJoined, setPlayerJoined, idPartida } = props;

  useEffect(() => {
    async function updatePlayers() {
      if (playerJoined) {
        getPlayers(idPartida)
          .then(async (response) => {
            console.log('response es', response);
            setRows(response?.players);
            setPlayerJoined(false);
          })
          .catch((error) => {
            console.error('Oops something went wrong..', error);
          });
      }
    }
    updatePlayers();
  }, [playerJoined, idPartida, setPlayerJoined]);

  return (
    <List>
      {mostrarJugadores(rows)}
    </List>
  );
}

export default ListarJugadores;
