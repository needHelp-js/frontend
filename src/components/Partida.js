import React, { useEffect, useState } from 'react';
import { Button, Box, Grid, Stack } from '@mui/material';
import { SocketSingleton } from './connectionSocket';
import './Partida.css';
import Sospechar from './Sospechar';
import Tablero from './Tablero';
import RespuestaDado from './RespuestaDado';

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

async function getPositions(idPartida, idPlayer, dado){
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const endpoint = process.env.REACT_APP_URL_SERVER.concat(
    '/', idPartida, '/availablePositions/', idPlayer, '?diceNumber=', dado
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
  const [dado, setDado] = useState(0);
  const [tirando, setTirando] = useState(false);
  const [tiroCompleto, setTiroCompleto] = useState(false);
  const [availablePositions, setAvailablePositions] = useState([]);
  const [showAvailable, setShowAvailable] = useState(false);

  const DadoUrl = process.env.REACT_APP_URL_SERVER.concat('/', idPartida, '/dice/', idPlayer);
  
  useEffect(() => {
    console.log('en partida ws singleton:', SocketSingleton.getInstance());
    SocketSingleton.getInstance().onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'SUSPICION_MADE_EVENT') {
        const mensajeSospecha = 'Se sospecho por '.concat(message.payload.card1Name, ' y ', message.payload.card2Name);
        setSuspectMessage(mensajeSospecha);
        console.log('se sospecho por:', message.payload.card1Name, message.payload.card2Name);
      }else if (message.type === 'MOVE_PLAYER_EVENT'){
        setStarting(true);
      }else if(message.type === 'DICE_ROLL_EVENT') {
        console.log('ha tirado el dado', message?.payload);
        setDado(message?.payload);
        setTiroCompleto(true);
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
          }
          setPlayers(response?.players);
          setCurrentTurn(response?.currentTurn)
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

  useEffect(() =>{
    async function getAvailablePositions(){
      getPositions(idPartida, idPlayer, dado)
      .then((response) => {
        console.log('posiciones disponibles', response?.availablePositions);
        setAvailablePositions(response?.availablePositions);
        setShowAvailable(true);
        setDado(0);
      })
      .catch((error) => {
        setErrorMessage(error);
        setHasError(true);
        console.error(error);
      });
    }

    if(dado !== 0){
      getAvailablePositions()
    }

  },[dado]);

/*   useEffect(() =>{
    if(suspectComplete){
      setShowAvailable(false);
    }
  },[suspectComplete]); */

  if (hasError && !suspecting) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Grid container spacing={4}>
        <Grid item> 
          <Box sx={{
                width: 640,
                height: 640
          }}>
            <Tablero
              players={players}
              showAvailable={showAvailable}
              availablePositions={availablePositions}
            />
          </Box>
        </Grid>
        <Grid item>
          <Stack spacing={2} alignItems="center"> 
              <Button
                variant="contained"
                onClick={() => setSuspecting(true)}
              >
                Sospechar
              </Button>
              <div className="suspectButton">
                <Button
                  onClick={() => setTirando(true)}
                  variant="contained"
                >
                  Tirar Dado
                </Button> 
                <RespuestaDado 
                  DadoUrl={DadoUrl}
                  dado={dado}
                  tirando={tirando}
                  setTirando={setTirando}
                  tiroCompleto={tiroCompleto}
                />
              </div>
              <p>
                {errorMessage}
              </p>
          </Stack>
        </Grid>
      </Grid>
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
        <Grid container spacing={4}>
        <Grid item> 
          <Box sx={{
                width: 640,
                height: 640
          }}>
            <Tablero
              players={players}
              showAvailable={showAvailable}
              availablePositions={availablePositions}
            />
          </Box>
        </Grid>
        <Grid item>
          <Stack spacing={2} alignItems="center"> 
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
              <div className="suspectButton">
                <Button
                  disabled
                  variant="contained"
                >
                  Tirar Dado
                </Button> 
                <RespuestaDado 
                  DadoUrl={DadoUrl}
                  dado={dado}
                  tirando={tirando}
                  setTirando={setTirando}
                  tiroCompleto={tiroCompleto}
                />
              </div>
          </Stack>
        </Grid>
      </Grid>
      </div>
    );
  }

  if(tiroCompleto){
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Grid container spacing={4}>
        <Grid item> 
          <Box sx={{
                width: 640,
                height: 640
          }}>
            <Tablero
              players={players}
              showAvailable={showAvailable}
              availablePositions={availablePositions}
            />
          </Box>
        </Grid>
        <Grid item>
          <Stack spacing={2} alignItems="center"> 
              <Button
                variant="contained"
                onClick={() => setSuspecting(true)}
              >
                Sospechar
              </Button>
              <p>
                {suspectMessage}
              </p>
              <div className="suspectButton">
                <Button
                  disabled
                  variant="contained"
                >
                  Tirar Dado
                </Button> 
                <RespuestaDado 
                  DadoUrl={DadoUrl}
                  dado={dado}
                  tirando={tirando}
                  setTirando={setTirando}
                  tiroCompleto={tiroCompleto}
                />
              </div>
          </Stack>
        </Grid>
      </Grid>
      </div>
    );
  }

  return (
    <div>
      <h2>Bienvenido a la Partida</h2>
      <Grid container spacing={4}>
        <Grid item> 
          <Box sx={{
                width: 640,
                height: 640
          }}>
            <Tablero
              players={players}
              showAvailable={showAvailable}
              availablePositions={availablePositions}
            />
          </Box>
        </Grid>
        <Grid item>
          <Stack spacing={2} alignItems="center"> 
              <Button
                variant="contained"
                onClick={() =>setSuspecting(true)}
                >
                Sospechar
              </Button>
              <Button
                onClick={() => {
                  setTirando(true);
                  console.log('tira el dado player',idPlayer);
                }}
                variant="contained"
              >
                Tirar Dado
              </Button> 
              <div className="suspectButton">
                <RespuestaDado 
                  DadoUrl={DadoUrl}
                  dado={dado}
                  tirando={tirando}
                  setTirando={setTirando}
                  tiroCompleto={tiroCompleto}
                />
              </div>
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

export default Partida;
