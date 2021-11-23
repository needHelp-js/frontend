import React, { useEffect, useState } from 'react';
import { Container, Button, Stack } from '@mui/material';
import { Redirect } from 'react-router-dom';
import CartasJugador from './CartasJugador';
import SocketSingleton from './connectionSocket';
import './Partida.css';
import Sospechar from './Sospechar';
import RespuestaDado from './RespuestaDado';
import Acusar from './Acusar';
import { accusationState } from '../utils/constants';
import { URL_HOME } from '../routes';

function Partida(props) {
  const { location } = props;
  const { idPartida, idPlayer } = location.state;
  const [suspecting, setSuspecting] = useState(false);
  const [suspectDisabled, setSuspectDisabled] = useState(false);
  const [suspectComplete, setSuspectComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suspectMessage, setSuspectMessage] = useState('');
  const [playerCards, setPlayerCards] = useState([]);

  /* Estados de la acusacion */
  const [accusationStage, setAccusationStage] = useState(
    accusationState.NOT_ACCUSING,
  );
  const [playerWon, setPlayerWon] = useState(false);
  const [envelopeCards, setEnvelopeCards] = useState([]);
  const [accusingPlayerNickname, setAccusingPlayerNickname] = useState('');
  const [accusingPlayerId, setAccusingPlayerId] = useState(0);
  const [accusationDisabled, setAccusationDisabled] = useState(false);

  const [redirectOutofGame, setRedirectOutOfGame] = useState(false);

  const urlDado = `${process.env.REACT_APP_URL_SERVER}/${idPartida}/dice/${idPlayer}`;

  useEffect(() => {
    SocketSingleton.getInstance().addEventListener('message', (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'SUSPICION_MADE_EVENT':
          const mensaje = `Se sospecho por ${message.payload.card1Name} y ${message.payload.card2Name}`;
          setSuspectMessage(mensaje);
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

        default:
          break;
      }
    });
  }, []);

  useEffect(() => {
    if (suspectComplete) {
      setSuspectDisabled(true);
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

  if (hasError && !suspecting) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Stack alignItems="center" spacing={2}>
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
          <p>{errorMessage}</p>
        </Stack>
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
      />
    );
  }

  if (suspectComplete) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
        <Stack alignItems="center" spacing={2}>
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
          <p>{suspectMessage}</p>
        </Stack>
      </div>
    );
  }

  /* Componente de acusacion */
  let acusarComponent;

  switch (accusationStage) {
    case accusationState.ACCUSING:
      acusarComponent = (
        <Acusar
          setAccusationStage={setAccusationStage}
          setHasError={setHasError}
          setErrorMessage={setErrorMessage}
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
              {accusingPlayerNickname}
              {' '}
              ha ganado!
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

  return (
    <div>
      <h2>Bienvenido a la Partida</h2>
      <Stack alignItems="center" spacing={2}>
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
        {acusarComponent}
        <RespuestaDado DadoUrl={urlDado} />
        <CartasJugador cards={playerCards} />
      </Stack>
    </div>
  );
}

export default Partida;
