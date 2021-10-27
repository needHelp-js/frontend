import { Button } from '@mui/material';
import React, { useEffect, createRef } from 'react';

function Lobby(props) {
  const {
    idPartida, nombrePartida, idPlayer, nicknamePlayer, isHost,
  } = props;
  const socketURL = 'ws://localhost:8000/games/'.concat(idPartida, '/ws/', idPlayer);
  const playerSocket = createRef();
  useEffect(() => {
    playerSocket.current = new WebSocket(socketURL);
    playerSocket.current.onopen = () => {
      console.log('socket created:', idPartida, idPlayer);
    };
  }, [idPartida, idPlayer, playerSocket, socketURL]);

  if (isHost) {
    return (
      <div>
        <h2 style={{ 'text-align': 'center' }}>
          {nombrePartida}
        </h2>
        <p>
          Usted es el Host:
          {' '}
          {nicknamePlayer}
          {' '}
          ID:
          {' '}
          {idPlayer}
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
        Usted es el Jugador:
        {' '}
        {nicknamePlayer}
        {' '}
        ID:
        {' '}
        {idPlayer}
      </p>
    </div>

  );
}

export default Lobby;
