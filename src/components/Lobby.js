import { Button } from '@mui/material';
import React, { useEffect, createRef } from 'react';
import ListarJugadores from './ListarJugadores';
import './Lobby.css';

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
        <h4>Jugadores en la partida:</h4>
        <ListarJugadores />
        <div style={{ 'text-align': 'center' }}>
          <Button variant="outlined">
            Iniciar Partida
          </Button>
        </div>
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
      <h4>Jugadores en la partida:</h4>
      <ListarJugadores />
    </div>

  );
}

export default Lobby;
