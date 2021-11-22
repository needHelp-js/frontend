import React, { useEffect, useState } from 'react';
import {
  Button, Box, Grid, Stack,
} from '@mui/material';
import CartasJugador from './CartasJugador';
import SocketSingleton from './connectionSocket';
import './Partida.css';
import Sospechar from './Sospechar/Sospechar';
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

async function getPositions(idPartida, idPlayer, dado) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const endpoint = process.env.REACT_APP_URL_SERVER.concat(
    '/', idPartida, '/availablePositions/', idPlayer, '?diceNumber=', dado,
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
  const { idPartida, idPlayer } = props.location.state; // eslint-disable-line
  const [suspecting, setSuspecting] = useState(false);
  const [suspectComplete, setSuspectComplete] = useState(false);
  const [suspectDisabled, setSuspectDisabled] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suspectMessage, setSuspectMessage] = useState('');
  const [playerCards, setPlayerCards] = useState([]);
  const [order, setOrder] = useState(-1);
  const [players, setPlayers] = useState([]);
  const [starting, setStarting] = useState(false);
  const [isTurn, setIsTurn] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(-1);
  const [dado, setDado] = useState(0);
  const [tiroCompleto, setTiroCompleto] = useState(false);
  const [moveComplete, setMoveComplete] = useState(false);
  const [availablePositions, setAvailablePositions] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showAvailable, setShowAvailable] = useState(false);
  const [gettingTurn, setGettingTurn] = useState(false);

  const urlDado = `${process.env.REACT_APP_URL_SERVER}/${idPartida}/dice/${idPlayer}`;

  useEffect(() => {
    let isMounted = true;
    console.log('en partida ws singleton:', SocketSingleton.getInstance());
    SocketSingleton.getInstance().addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === 'SUSPICION_MADE_EVENT') {
        const mensaje = `Se sospecho por ${message.payload.card1Name} y ${message.payload.card2Name}`;
        setSuspectMessage(mensaje);
      } else if (message.type === 'DEAL_CARDS_EVENT' && isMounted) {
        setPlayerCards(message.payload);
        console.log(message);
       } else if (message.type === 'MOVE_PLAYER_EVENT') {
        setDado(0);
        setShowAvailable(false);
        setAvailableRooms([]);
        setMoveComplete(true);
        setStarting(true);
      } else if (message.type === 'DICE_ROLL_EVENT') {
        if (isTurn) {
          console.log('ha tirado el dado', message?.payload);
          setDado(message?.payload);
          setTiroCompleto(true);
        }
      } else if(message.type === "ENTER_ROOM_EVENT"){
        setDado(0);
        setShowAvailable(false);
        setAvailableRooms([]);
        setMoveComplete(true);
        setStarting(true);
      }
    });
    setStarting(true);
    return () =>{
      isMounted = false;
    }
  }, [isTurn, playerCards]);

  useEffect(() => {
    let isMounted = true;
    async function getGameDetails() {
      getGameInfo(idPartida, idPlayer)
        .then((response) => {
          if (isMounted) {
            for (let i = 0; i < response?.players.length; i++) {
              if (idPlayer === response?.players[i].id) {
                setOrder(i);
                break;
              }
            }
            setPlayers(response?.players);
            setCurrentTurn(response?.currentTurn);
          }
        }).then(() => {
          console.log('game info:', players, isTurn, order);
          setStarting(false);
          setGettingTurn(true);
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage(error);
          setHasError(true);
        });
    }

    if (starting) {
      getGameDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [starting, idPartida, idPlayer, players, order]);

  useEffect(() => {
    if (gettingTurn) {
      if (order !== -1 && players !== []) {
        if (currentTurn === players[order].turnOrder) {
          setIsTurn(true);
        }
      }
    }
  }, [gettingTurn]);

  useEffect(() => {
    async function getAvailablePositions() {
      getPositions(idPartida, idPlayer, dado)
        .then((response) => {
          setAvailablePositions(response?.availablePositions);
          setAvailableRooms(response?.availableRooms);
          setShowAvailable(true);
        })
        .catch((error) => {
          setErrorMessage(error);
          setHasError(true);
          console.error(error);
        });
    }

    if (dado !== 0) {
      getAvailablePositions();
    }
  }, [dado, moveComplete]);

  useEffect(() => {
    if (suspectComplete) {
      setShowAvailable(false);
      setSuspectDisabled(true);
    }
  }, [suspectComplete]);

  if (hasError && !suspecting && isTurn && !tiroCompleto) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Grid container spacing={4}>
          <Grid item>
            <Box sx={{
              width: 640,
              height: 640,
            }}
            >
              <Tablero
                players={players}
                showAvailable={showAvailable}
                setShowAvailable={setShowAvailable}
                dado={dado}
                idPartida={idPartida}
                idPlayer={idPlayer}
                availablePositions={availablePositions}
                availableRooms={availableRooms}
              />
            </Box>
          </Grid>
          <Grid item>
            <Stack spacing={2} alignItems="center">
            <Sospechar
              suspecting={suspecting}
              setSuspecting={setSuspecting}
              setSuspectComplete={setSuspectComplete}
              setHasError={setHasError}
              setErrorMessage={setErrorMessage}
              idPartida={idPartida}
              idPlayer={idPlayer}
              disabled={suspectDisabled}
            />
              <div className="suspectButton">
                <RespuestaDado
                  DadoUrl={urlDado}
                  dado={dado}
                  tiroCompleto={tiroCompleto}
                />
              </div>
              <p>
                {errorMessage}
              </p>
            </Stack>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (hasError && !suspecting && isTurn && tiroCompleto) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Grid container spacing={4}>
          <Grid item>
            <Box sx={{
              width: 640,
              height: 640,
            }}
            >
              <Tablero
                players={players}
                showAvailable={showAvailable}
                setShowAvailable={setShowAvailable}
                dado={dado}
                idPartida={idPartida}
                idPlayer={idPlayer}
                availablePositions={availablePositions}
                availableRooms={availableRooms}
              />
            </Box>
          </Grid>
          <Grid item>
            <Stack spacing={2} alignItems="center">
            <Sospechar
              suspecting={suspecting}
              setSuspecting={setSuspecting}
              setSuspectComplete={setSuspectComplete}
              setHasError={setHasError}
              setErrorMessage={setErrorMessage}
              idPartida={idPartida}
              idPlayer={idPlayer}
              disabled={suspectDisabled}
            />
              <div className="suspectButton">
                <RespuestaDado
                  DadoUrl={urlDado}
                  dado={dado}
                  tiroCompleto={tiroCompleto}
                  disabled
                />
              </div>
              <p>
                {errorMessage}
              </p>
            </Stack>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
    );
  }


  if (suspecting) {
    return (
      <Sospechar
        suspecting={suspecting}
        setSuspecting={setSuspecting}
        setSuspectComplete={setSuspectComplete}
        setHasError={setHasError}
        setErrorMessage={setErrorMessage}
        idPartida={idPartida}
        idPlayer={idPlayer}
        disabled={suspectDisabled}
      />
    );
  }
  if (suspectComplete && isTurn) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Grid container spacing={4}>
          <Grid item>
            <Box sx={{
              width: 640,
              height: 640,
            }}
            >
              <Tablero
                players={players}
                showAvailable={showAvailable}
                setShowAvailable={setShowAvailable}
                dado={dado}
                idPartida={idPartida}
                idPlayer={idPlayer}
                availablePositions={availablePositions}
                availableRooms={availableRooms}
              />
            </Box>
          </Grid>
          <Grid item>
            <Stack spacing={2} alignItems="center">
              <Button
                variant="contained"
                disabled
              >
                Sospechar
              </Button>
              <div className="suspectButton">
                <Button
                  disabled
                  variant="contained"
                >
                  Tirar Dado
                </Button>
              </div>
              <p>
                {suspectMessage}
              </p>
            </Stack>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
    );
  }
  if (moveComplete && isTurn) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Grid container spacing={4}>
          <Grid item>
            <Box sx={{
              width: 640,
              height: 640,
            }}
            >
              <Tablero
                players={players}
                showAvailable={false}
                setShowAvailable={setShowAvailable}
                dado={dado}
                idPartida={idPartida}
                idPlayer={idPlayer}
                availablePositions={availablePositions}
                availableRooms={availableRooms}
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
                <RespuestaDado
                  DadoUrl={urlDado}
                  dado={dado}
                  tiroCompleto={tiroCompleto}
                  disabled
                />
              </div>
            </Stack>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (suspectComplete && isTurn) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Grid container spacing={4}>
          <Grid item>
            <Box sx={{
              width: 640,
              height: 640,
            }}
            >
              <Tablero
                players={players}
                showAvailable={showAvailable}
                setShowAvailable={setShowAvailable}
                dado={dado}
                idPartida={idPartida}
                idPlayer={idPlayer}
                availablePositions={availablePositions}
                availableRooms={availableRooms}
              />
            </Box>
          </Grid>
          <Grid item>
            <Stack spacing={2} alignItems="center">
              <Sospechar
                suspecting={suspecting}
                setSuspecting={setSuspecting}
                setSuspectComplete={setSuspectComplete}
                setHasError={setHasError}
                setErrorMessage={setErrorMessage}
                idPartida={idPartida}
                idPlayer={idPlayer}
                disabled={suspectDisabled}
              />
              <div className="suspectButton">
                <Button
                  disabled
                  variant="contained"
                >
                  Tirar Dado
                </Button>
              </div>
              <p>
                {suspectMessage}
              </p>
            </Stack>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
    );
  }
  if (moveComplete && isTurn) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Grid container spacing={4}>
          <Grid item>
            <Box sx={{
              width: 640,
              height: 640,
            }}
            >
              <Tablero
                players={players}
                showAvailable={false}
                setShowAvailable={setShowAvailable}
                dado={dado}
                idPartida={idPartida}
                idPlayer={idPlayer}
                availablePositions={availablePositions}
                availableRooms={availableRooms}
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
                <RespuestaDado
                  DadoUrl={urlDado}
                  dado={dado}
                  tiroCompleto={tiroCompleto}
                  disabled
                />
              </div>
            </Stack>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (tiroCompleto && isTurn) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Grid container spacing={4}>
          <Grid item>
            <Box sx={{
              width: 640,
              height: 640,
            }}
            >
              <Tablero
                players={players}
                showAvailable={showAvailable}
                setShowAvailable={setShowAvailable}
                dado={dado}
                idPartida={idPartida}
                idPlayer={idPlayer}
                availablePositions={availablePositions}
                availableRooms={availableRooms}
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
                <RespuestaDado
                  DadoUrl={urlDado}
                  dado={dado}
                  tiroCompleto={tiroCompleto}
                  disabled
                />
              </div>
            </Stack>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
    );
  }
  
  if (!isTurn) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Grid container spacing={4}>
          <Grid item>
            <Box sx={{
              width: 640,
              height: 640,
            }}
            >
              <Tablero
                players={players}
                showAvailable={showAvailable}
                setShowAvailable={setShowAvailable}
                dado={dado}
                idPartida={idPartida}
                idPlayer={idPlayer}
                availablePositions={availablePositions}
                availableRooms={availableRooms}
              />
            </Box>
          </Grid>
          <Grid item>
            <Stack spacing={2} alignItems="center">
              <Button
                variant="contained"
                disabled
              >
                Sospechar
              </Button>
              <Button
                disabled
                variant="contained"
              >
                Tirar Dado
              </Button>
            </Stack>
            <CartasJugador cards={playerCards} />
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
            height: 640,
          }}
          >
            <Tablero
              players={players}
              showAvailable={showAvailable}
              setShowAvailable={setShowAvailable}
              dado={dado}
              idPartida={idPartida}
              idPlayer={idPlayer}
              availablePositions={availablePositions}
              availableRooms={availableRooms}
            />
          </Box>
        </Grid>
        <Grid item>
          <Stack
            alignItems="center"
            spacing={2}
          >
            <Sospechar
              suspecting={suspecting}
              setSuspecting={setSuspecting}
              setSuspectComplete={setSuspectComplete}
              setHasError={setHasError}
              setErrorMessage={setErrorMessage}
              idPartida={idPartida}
              idPlayer={idPlayer}
              disabled={suspectDisabled}
            />
            <RespuestaDado DadoUrl={urlDado} />
            <CartasJugador cards={playerCards} />
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

export default Partida;
