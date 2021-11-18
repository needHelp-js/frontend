import React, { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import { SocketSingleton } from './connectionSocket';
import './Partida.css';
import Sospechar from './Sospechar';
import Tablero from './Tablero';

async function getGameInfo(idPartida, idPlayer) {
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

function Partida(props) {
  const { idPartida, idPlayer } = props.location.state;
  const [suspecting, setSuspecting] = useState(false);
  const [suspectComplete, setSuspectComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suspectMessage, setSuspectMessage] = useState('');
  const [order, setOrder] = useState(-1);
  const [players, setPlayers] = useState([]);
  const [starting, setStarting] = useState(false);
  const [isTurn, setIsTurn] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(-1);

  useEffect(() => {
    console.log('en partida ws singleton:', SocketSingleton.getInstance());
    SocketSingleton.getInstance().onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'SUSPICION_MADE_EVENT') {
        const mensajeSospecha = 'Se sospecho por '.concat(message.payload.card1Name, ' y ', message.payload.card2Name);
        setSuspectMessage(mensajeSospecha);
        console.log('se sospecho por:', message.payload.card1Name, message.payload.card2Name);
      }
    };
    setStarting(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function getGameDetails(){
      getGameInfo(idPartida, idPlayer)
      .then((response) => {
        if(isMounted){
          for(let i=0; i < response?.players.length ; i++){
            if(idPlayer === response?.players[i].id){
              setOrder(i);
              break;
            }
            setPlayers(response?.players);
            setCurrentTurn(response?.currentTurn)
          }
        }
      }).then(() =>{
        console.log('game info:',players, isTurn, order);
        setStarting(false);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(error);
        setHasError(true);
      });
    }

    if(starting){
      getGameDetails();
    }

    /* if(order !== -1 && players !== []){
      console.log('players es',players);
      if(currentTurn === players[order].turnOrder){
        setIsTurn(true);
      }
    } */

    return () => {
      isMounted = false
    }

  }, [starting, idPartida, idPlayer, players, order]);

  if (hasError && !suspecting) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Box sx={{
            width: 640,
            height: 640
          }}>
            <Tablero
              players={players}
            />
        </Box>
        <div className="suspectButton">
          <Button
            variant="contained"
            onClick={() => setSuspecting(true)}
          >
            Sospechar
          </Button>
        </div>
        <p>
          {errorMessage}
        </p>
      </div>
    );
  }

  if (suspecting) {
    return (
      <Sospechar
        setSuspecting={setSuspecting}
        setSuspectComplete={setSuspectComplete}
        setHasError={setHasError}
        setErrorMessage={setErrorMessage}
        idPartida={idPartida}
        idPlayer={idPlayer}
      />
    );
  }
  if (suspectComplete) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <div className="suspectButton">
        <Box sx={{
            width: 640,
            height: 640
        }}>
          <Tablero
            players={players}
          />
        </Box>
          <Button
            variant="contained"
            disabled
            onClick={() => setSuspecting(true)}
          >
            Sospechar
          </Button>
          <p>
            {suspectMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Bienvenido a la Partida</h2>
      <Box sx={{
            width: 640,
            height: 640
      }}>
        <Tablero
          players={players}
        />
      </Box>
      <div className="suspectButton">
        <Button
          variant="contained"
          onClick={() => setSuspecting(true)}
        >
          Sospechar
        </Button>
      </div>
    </div>
  );
}

export default Partida;
