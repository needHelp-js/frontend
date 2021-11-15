import { Button } from '@mui/material';
import React, { useEffect, createRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { URL_PARTIDA } from '../routes';
import ListarJugadores from './ListarJugadores';
import './Lobby.css';

async function requestStart(idPartida, idPlayer) {
  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  };
  const endpointPrefix = process.env.REACT_APP_URL_SERVER;
  const endpoint = endpointPrefix.concat('/', idPartida, '/begin/', idPlayer);
  const data = fetch(endpoint, requestOptions)
    .then(async (response) => {
      if (!response.ok) {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const payload = isJson && await response.json();
        const error = (payload.Error) || response.status;
        return Promise.reject(error);
      }
    })
    .catch((error) => Promise.reject(error));
  return data;
}

function Lobby(props) {
  const {
    idPartida, nombrePartida, idPlayer, isHost,
  } = props.location.state;
  const [playerJoined, setPlayerJoined] = useState(false);
  const [starting, setStarting] = useState(false);
  const [started, setStarted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [nPlayers, setNPlayers] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const wsPrefix = process.env.REACT_APP_URL_WS;
  const socketURL = wsPrefix.concat('/', idPartida, '/ws/', idPlayer);
  const playerSocket = createRef();

  useEffect(() => {
    playerSocket.current = new WebSocket(socketURL);
    setPlayerJoined(true);
    let isMounted = true;

    playerSocket.current.onopen = () => {
      console.log('socket created:', idPartida, idPlayer);
    };
    playerSocket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'PLAYER_JOINED_EVENT' && isMounted) {
        setPlayerJoined(true);
      } else if (message.type === 'BEGIN_GAME_EVENT' && isMounted) {
        setStarted(true);
        isMounted = false;
      }
    };

    return () => {
      isMounted = false;
    };
  }, [idPartida, idPlayer, socketURL]);

  useEffect(() => {
    async function startGame() {
      requestStart(idPartida, idPlayer)
        .catch((error) => {
          setErrorMessage(error);
          setHasError(true);
          setStarting(false);
          console.error('no se pudo iniciar la partida', errorMessage);
        });
    }
    if (starting) {
      startGame();
    }
  }, [starting, idPartida, idPlayer]);

  if (started) {
    return (
      <Redirect to={{
        pathname: URL_PARTIDA,
      }}
      />
    );
  }

  if (hasError) {
    return (
      <div>
        <h2>
          {nombrePartida}
        </h2>
        <h4>Jugadores en la partida:</h4>
        <ListarJugadores
          playerJoined={playerJoined}
          setPlayerJoined={setPlayerJoined}
          setNPlayers={setNPlayers}
          idPartida={idPartida}
          idPlayer={idPlayer}
        />
        <p>
          {errorMessage}
        </p>
        <div className="startButton">
          <Button
            variant="outlined"
            onClick={() => setStarting(true)}
          >
            Iniciar Partida
          </Button>
        </div>
      </div>

    );
  }

  if (isHost && nPlayers >= 2) {
    return (
      <div>
        <h2>
          {nombrePartida}
        </h2>
        <h4>Jugadores en la partida:</h4>
        <ListarJugadores
          playerJoined={playerJoined}
          setPlayerJoined={setPlayerJoined}
          setNPlayers={setNPlayers}
          idPartida={idPartida}
          idPlayer={idPlayer}
        />
        <div className="startButton">
          <Button
            variant="outlined"
            onClick={() => setStarting(true)}
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
        setNPlayers={setNPlayers}
        idPartida={idPartida}
        idPlayer={idPlayer}
      />
      <div className="startButton">
        <Button
          variant="outlined"
          disabled
        >
          Iniciar Partida
        </Button>
      </div>
    </div>

  );
}

export default Lobby;
