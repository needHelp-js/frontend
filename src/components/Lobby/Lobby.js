import { Button } from '@mui/material';
import React, { useEffect, createRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { URL_PARTIDA } from '../../routes';
import ListarJugadores from './ListarJugadores';
import SocketSingleton from '../connectionSocket'
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
        const error = response.status;
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
  const wsPrefix = process.env.REACT_APP_URL_WS;
  const socketURL = wsPrefix.concat('/', idPartida, '/ws/', idPlayer);

  useEffect(() => {
    SocketSingleton.init(new WebSocket(socketURL));
    console.log('ws singleton es:',SocketSingleton.getInstance());
    setPlayerJoined(true);
    let isMounted = true;

    SocketSingleton.getInstance().onopen = () => {
      console.log('socket created:', idPartida, idPlayer);
    };
    SocketSingleton.getInstance().onmessage = (event) => {
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
          console.error('no se pudo iniciar la partida', error);
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
        state:{
          idPartida: idPartida,
          idPlayer: idPlayer,
        }
      }}
      />
    );
  }

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
          idPlayer={idPlayer}
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
        idPlayer={idPlayer}
      />
    </div>

  );
}

export default Lobby;
