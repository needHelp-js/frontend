import { Button } from '@mui/material';
import React from 'react';

function Lobby(props) {
  const {
    idPartida, nombrePartida, idHost, nicknameHost, isHost,
  } = props;

  console.log('isHost:', isHost);

  if (isHost) {
    return (
      <div>
        <h2 style={{ 'text-align': 'center' }}>
          {nombrePartida}
        </h2>
        <p>
          Usted es el Host:
          {' '}
          {nicknameHost}
          {' '}
          ID:
          {' '}
          {idHost}
        </p>
        <Button variant="outlined">
          Iniciar Partida
        </Button>
      </div>

    );
  }
  return (
    <div>
      <h2 style={{ 'text-align': 'center' }}>
        {nombrePartida}
      </h2>
      <p>
        Usted es el Host:
        {' '}
        {nicknameHost}
        {' '}
        ID:
        {' '}
        {idHost}
      </p>
      <Button variant="outlined" disabled>
        Iniciar Partida
      </Button>
    </div>

  );
}

export default Lobby;
