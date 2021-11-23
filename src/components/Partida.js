import React, { useEffect, useState } from 'react';
import {
  Button, Box, Grid, Stack,
} from '@mui/material';
import CartasJugador from './CartasJugador';
import SocketSingleton from './connectionSocket';
import './Partida.css';
import RespuestaSospecha from './RespuestaSospecha';
import Sospechar from './Sospechar/Sospechar';
import Tablero from './Tablero';
import RespuestaDado from './RespuestaDado';
import TerminarTurno from './TerminarTurno'

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
  const [respondiendo, setRespondiendo] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suspectMessage, setSuspectMessage] = useState('');
  const [status, setStatus] = useState('');
  const [idPlayerAsking, setIdPlayerAsking] = useState(false);
  const [mostrandoRespuesta, setMostrandoRespuesta] = useState(false);
  const [responseCard, setResponseCard] = useState([]);
  const [suspectedCards, setSuspectedCards] = useState([]);
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
    SocketSingleton.getInstance().addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === 'SUSPICION_MADE_EVENT') {
        console.log('se sospecho por:', message.payload.card1Name, message.payload.card2Name);
        const mensajeEvento = `El jugador ${message.payload.playerId} sospecho por ${message.payload.card1Name}, ${message.payload.card2Name} y ${message.payload.roomName} `;
        console.log(message, mensajeEvento);
        setStatus(mensajeEvento);
        setHasError(false);
      } else if (message.type === 'DEAL_CARDS_EVENT' && isMounted) {
        setPlayerCards(message.payload);
        console.log(message);
      } else if (message.type === 'YOU_ARE_SUSPICIOUS_EVENT' && isMounted) {
        setHasError(false);
        setSuspectedCards(message.payload.cards);
        setIdPlayerAsking(message.payload.playerId);
        setRespondiendo(true);
      } else if (message.type === 'SUSPICION_RESPONSE_EVENT') {
        setHasError(false);
        setResponseCard(message.payload.cardName);
        setMostrandoRespuesta(true);
      } else if (message.type === 'PLAYER_REPLIED_EVENT') {
        const mensajeEvento = `El jugador ${message.payload.playerId} respondio a la sospecha`;
        setStatus(mensajeEvento);
        setHasError(false);
      } else if (message.type === 'SUSPICION_FAILED_EVENT') {
        setStatus(message.payload.Error);
        setHasError(false);
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
      } else if(message.type === "TURN_ENDED_EVENT"){
        if(message.payload.playerId === idPlayer){
          setIsTurn(true);
        }
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
          setStatus(error);
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
          setStatus(error);
          setHasError(true);
          console.error(error);
        });
    }

    if (dado !== 0) {
      getAvailablePositions();
    }
  }, [dado, moveComplete]);


  const url = process.env.REACT_APP_URL_SERVER.concat('/', idPartida, '/dice/', idPlayer);
  const terminarTurnoUrl = process.env.REACT_APP_URL_SERVER.concat('/', idPartida, '/endTurn/', idPlayer);
  useEffect(() => {
    if (suspectComplete) {
      setShowAvailable(false);
      setSuspectDisabled(true);
    }
  }, [suspectComplete]);

  if (respondiendo || mostrandoRespuesta) {
    return (
      <RespuestaSospecha
        idPartida={idPartida}
        idPlayer={idPlayer}
        suspectedCards={suspectedCards}
        idPlayerAsking={idPlayerAsking}
        cartaRespuesta={responseCard}
        setRespondiendo={setRespondiendo}
        mostrandoRespuesta={mostrandoRespuesta}
        setMostrandoRespuesta={setMostrandoRespuesta}
      />
    );
  }

  if (suspecting) {
    return (
      <Sospechar
        suspecting={suspecting}
        setSuspecting={setSuspecting}
        setSuspectComplete={setSuspectComplete}
        setHasError={setHasError}
        setErrorMessage={setStatus}
        idPartida={idPartida}
        idPlayer={idPlayer}
        disabled={suspectDisabled}
      />
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
              <Sospechar disabled />
              <div className="centeredButton">
                <RespuestaDado disabled />
              </div>
              <TerminarTurno endpoint={terminarTurnoUrl} disabled />
              <p>
                {status}
              </p>
            </Stack>
          </Grid>
          <Grid item>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (hasError && !tiroCompleto) {
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
            <Sospechar disabled />
              <div className="centeredButton">
                <RespuestaDado
                  DadoUrl={urlDado}
                  dado={dado}
                  tiroCompleto={tiroCompleto}
                />
              </div>
              <TerminarTurno endpoint={terminarTurnoUrl} disabled />
              <p>
                {status}
              </p>
            </Stack>
          </Grid>
          <Grid item>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (hasError && tiroCompleto) {
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
            <Sospechar disabled={suspectDisabled} />
              <div className="centeredButton">
                <RespuestaDado disabled />
              </div>
              <p>
                {errorMessage}
              </p>
              <TerminarTurno endpoint={terminarTurnoUrl} disabled={true}/>
              <p>
                {status}
              </p>
            </Stack>
          </Grid>
          <Grid item>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (moveComplete) {
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
              <Sospechar
                suspecting={suspecting}
                setSuspecting={setSuspecting}
                setSuspectComplete={setSuspectComplete}
                setHasError={setHasError}
                setErrorMessage={setStatus}
                idPartida={idPartida}
                idPlayer={idPlayer}
              />
              <div className="centeredButton">
                <RespuestaDado disabled />
              </div>
              <TerminarTurno endpoint={terminarTurnoUrl} />
              <p>
                {status}
              </p>
            </Stack>
          </Grid>
          <Grid item>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
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
              <Sospechar disabled />
              <RespuestaDado disabled />
              <TerminarTurno endpoint={terminarTurnoUrl}/>
              <p>
                {status}
              </p>
            </Stack>
          </Grid>
          <Grid item>
            <CartasJugador cards={playerCards} />
          </Grid>
        </Grid>
      </div>
   );
  }
  


  if (tiroCompleto) {
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
                setErrorMessage={setStatus}
                idPartida={idPartida}
                idPlayer={idPlayer}
                disabled={suspectDisabled}
              />
              <div className="suspectButton">
                <RespuestaDado disabled />
              </div>
              <TerminarTurno endpoint={terminarTurnoUrl} disabled={true} />
              <p>
                {status}
              </p>
            </Stack>
          </Grid>
          <Grid item>
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
              setErrorMessage={setStatus}
              idPartida={idPartida}
              idPlayer={idPlayer}
              disabled={suspectDisabled}
            />
            <RespuestaDado DadoUrl={urlDado} />
            <TerminarTurno endpoint={terminarTurnoUrl} disabled={true} />
            <p>
              {status}
            </p>
          </Stack>
        </Grid>
        <Grid item>
          <CartasJugador cards={playerCards} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Partida;
