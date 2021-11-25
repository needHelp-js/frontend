import React, { useEffect, useState } from 'react';
import {
  Container, Button, Stack, Grid, Box,
} from '@mui/material';
import { Redirect } from 'react-router-dom';
import CartasJugador from './CartasJugador';
import SocketSingleton from './connectionSocket';
import './Partida.css';
import Sospechar from './Sospechar';
import RespuestaDado from './RespuestaDado';
import Acusar from './Acusar';
import { accusationState } from '../utils/constants';
import { URL_HOME } from '../routes';
import RespuestaSospecha from './RespuestaSospecha';
import Tablero from './Tablero';
import MostrarJugadores from './MostrarJugadores';
import TerminarTurno from './TerminarTurno';

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
  const { location } = props;
  const { idPartida, idPlayer } = location.state;
  const [suspecting, setSuspecting] = useState(false);
  const [suspectComplete, setSuspectComplete] = useState(false);
  const [respondiendo, setRespondiendo] = useState(false);
  const [status, setStatus] = useState('');
  const [idPlayerAsking, setIdPlayerAsking] = useState(false);
  const [mostrandoRespuesta, setMostrandoRespuesta] = useState(false);
  const [responseCard, setResponseCard] = useState([]);
  const [suspectedCards, setSuspectedCards] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [playerWon, setPlayerWon] = useState(false);
  const [envelopeCards, setEnvelopeCards] = useState([]);
  const [accusingPlayerNickname, setAccusingPlayerNickname] = useState('');
  const [accusingPlayerId, setAccusingPlayerId] = useState(0);
  const [accusationDisabled, setAccusationDisabled] = useState(false);
  const [redirectOutofGame, setRedirectOutOfGame] = useState(false);
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

  /* Estados de la acusacion */
  const [accusationStage, setAccusationStage] = useState(
    accusationState.NOT_ACCUSING,
  );

  const urlDado = `${process.env.REACT_APP_URL_SERVER}/${idPartida}/dice/${idPlayer}`;

  useEffect(() => {
    let isMounted = true;
    SocketSingleton.getInstance().addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (isMounted) {
        switch (message.type) {
          case 'SUSPICION_MADE_EVENT':
            const mensajeSospecha = `El jugador ${message.payload.playerNickname} sospecho por 
              ${message.payload.card1Name}, ${message.payload.card2Name} y ${message.payload.roomName} `;
            setStatus(mensajeSospecha);
            break;

          case 'DEAL_CARDS_EVENT':
            setPlayerCards(message.payload);
            break;

          case 'PLAYER_ACCUSED_EVENT':
            setAccusationStage(accusationState.WAITING_FOR_ACCUSATION_RESPONSE);
            setAccusingPlayerNickname(message.payload.playerNickname);
            setAccusingPlayerId(message.payload.playerId);
            break;

          case 'PLAYER_LOST_EVENT':
            setAccusationStage(accusationState.ACCUSATION_COMPLETED);
            setPlayerWon(false);
            setAccusingPlayerNickname(message.payload.playerNickname);
            setAccusingPlayerId(message.payload.playerId);

            break;

          case 'GAME_ENDED_EVENT':
            setAccusationStage(accusationState.ACCUSATION_COMPLETED);
            setPlayerWon(true);
            setAccusingPlayerNickname(message.payload.playerNickname);
            setAccusingPlayerId(message.payload.playerId);
            const cards = message.payload.cardsInEnvelope.map((card) => card.name);
            setEnvelopeCards(cards);

            break;
          case 'YOU_ARE_SUSPICIOUS_EVENT':
            setSuspectedCards(message.payload.cards);
            setIdPlayerAsking(message.payload.playerId);
            setRespondiendo(true);
            break;
          case 'SUSPICION_RESPONSE_EVENT':
            setResponseCard(message.payload.cardName);
            setMostrandoRespuesta(true);
            setAccusationDisabled(true);
            break;
          case 'PLAYER_REPLIED_EVENT':
            const mensajeRespuesta = `El jugador ${message.payload.playerNickname} respondio a la sospecha`;
            setStatus(mensajeRespuesta);
            break;
          case 'SUSPICION_FAILED_EVENT':
            setStatus(message.payload.Error);
            setAccusationDisabled(true);
            break;
          case 'MOVE_PLAYER_EVENT':
            setDado(0);
            setShowAvailable(false);
            setAvailableRooms([]);
            setMoveComplete(true);
            setStarting(true);
            break;
          case 'DICE_ROLL_EVENT':
            if (isTurn) {
              setDado(message?.payload);
              setTiroCompleto(true);
            }
            break;
          case 'ENTER_ROOM_EVENT':
            setDado(0);
            setShowAvailable(false);
            setAvailableRooms([]);
            setMoveComplete(true);
            setStarting(true);
            break;
          case 'TURN_ENDED_EVENT':
            if (message.payload.playerId === idPlayer) {
              setIsTurn(true);
              setTiroCompleto(false);
              setMoveComplete(false);
              setAccusationDisabled(false);
              setSuspectComplete(false);
              setStatus('');
            }else{
              setIsTurn(false);
              setTiroCompleto(false);
              setMoveComplete(false);
              setAccusationDisabled(true);
              setSuspectComplete(false);
              setStatus('');
            }
            break;
          case 'SUSPICION_MADE_EVENT':
            if(message.payload.playerId == idPlayer){
              setAccusationDisabled(true);
            }
            break;
          default:
            setIsTurn(false);
            break;
        }
      }
    });

    setStarting(true);

    return () => {
      isMounted = false;
    };
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
          console.error(error);
        });
    }

    if (dado !== 0) {
      getAvailablePositions();
    }
  }, [dado, moveComplete]);

  const terminarTurnoUrl = process.env.REACT_APP_URL_SERVER.concat('/', idPartida, '/endTurn/', idPlayer);
  useEffect(() => {
    if (suspectComplete) {
      setShowAvailable(false);
    }
  }, [suspectComplete]);

  if (redirectOutofGame) {
    return (
      <Redirect
        to={{
          pathname: URL_HOME,
        }}
      />
    );
  }

  /* Componente de acusacion */
  let acusarComponent;

  switch (accusationStage) {
    case accusationState.ACCUSING:
      acusarComponent = (
        <Acusar
          setAccusationStage={setAccusationStage}
          setErrorMessage={setStatus}
          idPartida={idPartida}
          idPlayer={idPlayer}
        />
      );

      break;
    case accusationState.WAITING_FOR_ACCUSATION_RESPONSE:
      acusarComponent = (
        <Container>
          <h4>
            Jugador
            {accusingPlayerNickname}
            {' '}
            esta acusando...
          </h4>
        </Container>
      );

      break;

    case accusationState.ACCUSATION_COMPLETED:
      if (playerWon) {
        acusarComponent = (
          <Container>
            <h4>
              Jugador
              {' '}
              {accusingPlayerNickname}
              {' '}
              ha ganado!
            </h4>
            <br/>
            <h4>
              Cartas en el sobre:
            </h4>
            <CartasJugador cards={envelopeCards} />
            <Button
              variant="contained"
              onClick={() => {
                setAccusationStage(accusationState.NOT_ACCUSING);
                setRedirectOutOfGame(true);
                SocketSingleton.destroy();
              }}
              style={{ marginTop: '5px' }}
            >
              Salir de la partida
            </Button>
          </Container>
        );
      } else {
        acusarComponent = (
          <Container>
            <h4>
              Jugador
              {' '}
              {accusingPlayerNickname}
              {' '}
              ha perdido!
            </h4>
            <Button
              variant="contained"
              onClick={() => {
                setAccusationStage(accusationState.NOT_ACCUSING);
              }}
              style={{ marginTop: '5px' }}
            >
              Volver a la partida
            </Button>
          </Container>
        );
      }

      break;

    default:
      if (accusationDisabled) {
        acusarComponent = (
          <div>
            <Button variant="contained" disabled>
              Acusar
            </Button>
          </div>
        );
      } else {
        acusarComponent = (
          <div>
            <Button
              variant="contained"
              onClick={() => {
                setAccusationStage(accusationState.ACCUSING);
              }}
            >
              Acusar
            </Button>
          </div>
        );
      }

      break;
  }

  /* Termina componente de acusacion */

  if (accusationStage !== accusationState.NOT_ACCUSING) {
    return acusarComponent;
  }

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
        setErrorMessage={setStatus}
        idPartida={idPartida}
        idPlayer={idPlayer}
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
            <MostrarJugadores playerList={players} />
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
              setErrorMessage={setStatus}
              idPartida={idPartida}
              idPlayer={idPlayer}
              disabled={(suspectComplete || !moveComplete)}
            />
            {acusarComponent}
            <div className="centeredButton">
              <RespuestaDado
                DadoUrl={urlDado}
                dado={dado}
                tiroCompleto={tiroCompleto}
                disabled={(tiroCompleto || moveComplete)}
              />
            </div>
            <TerminarTurno endpoint={terminarTurnoUrl} disabled={(!moveComplete)} />
            <p>
              {status}
            </p>
          </Stack>
        </Grid>
        <Grid item>
          <MostrarJugadores playerList={players} />
        </Grid>
        <Grid item>
          <CartasJugador cards={playerCards} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Partida;
