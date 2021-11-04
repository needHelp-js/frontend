import { Button } from '@mui/material';
import React, { useEffect, createRef, useState } from 'react';
import ListarJugadores from './ListarJugadores';
import './Lobby.css';

async function requestStart(idPartida, idPlayer) {
  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  };
  const endpoint = 'http://localhost:8000/games'.concat('/', idPartida, '/begin/', idPlayer);
  const data = fetch(endpoint, requestOptions)
    .then(async (response) => {
      if (!response.ok) {
        const error = response.status;
        return Promise.reject(error);
      }
    })
    .catch((error) => Promise.reject(error));
  return data;
}

function Lobby(props) {
  const {
    idPartida, nombrePartida, idPlayer, nicknamePlayer, isHost,
  } = props.location.state;
  const [playerJoined, setPlayerJoined] = useState(false);
  const [starting, setStarting] = useState(false);
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
        console.log('se unio a la partida', message?.payload.playerNickname);
        setPlayerJoined(true);
      }
    };
  }, [idPartida, idPlayer, socketURL]);

  useEffect(() => {
    async function startGame() {
      requestStart(idPartida, idPlayer)
        .catch((error) => {
          console.error('no se pudo crear la partida', error);
        });
    }
    if (starting) {
      startGame();
    }
  }, [starting, idPartida, idPlayer]);

  if (isHost) {
    return (
      <div>
        <h2>
          {nombrePartida}
        </h2>
        <h4>Jugadores en la partida:</h4>
        <ListarJugadores
          playerJoined={playerJoined}
          setPlayerJoined={setPlayerJoined}
          idPartida={idPartida}
        />
        <div className="startButton">
          <Button
            variant="outlined"
            onClick={() => { setStarting(true); }}
          >
            Iniciar Partida
          </Button>
        </div>
      </div>

    );
  }
  return (
    <div>
      <h2>
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
