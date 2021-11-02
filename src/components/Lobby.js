import { Button } from '@mui/material';
import React, { useEffect, createRef, useState } from 'react';
import ListarJugadores from './ListarJugadores';
import './Lobby.css';

function Lobby(props) {
  const {
    idPartida, nombrePartida, idPlayer, nicknamePlayer, isHost,
  } = props;
  const [playerJoined, setPlayerJoined] = useState(false);
  const socketURL = 'ws://localhost:8000/games/'.concat(idPartida, '/ws/', idPlayer);
  const playerSocket = createRef();

  useEffect(() => {
    playerSocket.current = new WebSocket(socketURL);
    setPlayerJoined(true);

    playerSocket.current.onopen = () => {
      console.log('socket created:', idPartida, idPlayer);
    };
    playerSocket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'PLAYER_JOINED_EVENT') {
        console.log('se unio a la partida', message.payload.playerNickname);
        setPlayerJoined(true);
      }
    };
  }, [idPartida, idPlayer, socketURL]);

  if (isHost) {
    return (
      <div>
        <h2 style={{ 'text-align': 'center' }}>
          {nombrePartida}
        </h2>
        <h4>Jugadores en la partida:</h4>
        <ListarJugadores
          playerJoined={playerJoined}
          setPlayerJoined={setPlayerJoined}
          idPartida={idPartida}
        />
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
      <h4>Jugadores en la partida:</h4>
      <ListarJugadores
        playerJoined={playerJoined}
        setPlayerJoined={setPlayerJoined}
        idPartida={idPartida}
      />
    </div>

  );
}

export default Lobby;
