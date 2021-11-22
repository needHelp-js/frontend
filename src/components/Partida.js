import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import CartasJugador from './CartasJugador';
import SocketSingleton from './connectionSocket';
import './Partida.css';
import Sospechar from './Sospechar';
import RespuestaSospecha from './RespuestaSospecha';
import RespuestaDado from './RespuestaDado';

function Partida(props) {
  const { location } = props;
  const { idPartida, idPlayer } = location.state;
  const [suspecting, setSuspecting] = useState(false);
  const [suspectDisabled, setSuspectDisabled] = useState(false);
  const [suspectComplete, setSuspectComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [respondiendo, setRespondiendo] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suspectMessage, setSuspectMessage] = useState('');
  const [idPlayerAsking, setIdPlayerAsking] = useState(false);
  const [suspectedCards, setSuspectedCards] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);

  const urlDado = `${process.env.REACT_APP_URL_SERVER}/${idPartida}/dice/${idPlayer}`;

  useEffect(() => {
    let isMounted = true;
    SocketSingleton.getInstance().addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'SUSPICION_MADE_EVENT') {
        console.log('se sospecho por:', message.payload.card1Name, message.payload.card2Name);
      } else if (message.type === 'DEAL_CARDS_EVENT' && isMounted) {
        setPlayerCards(message.payload);
        console.log(message);
      } else if (message.type === 'YOU_ARE_SUSPICIOUS_EVENT' && isMounted) {
        console.log('vamos a responder');
        setHasError(false);
        setSuspectedCards(message.payload.cards);
        setIdPlayerAsking(message.payload.playerId);
        setRespondiendo(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [playerCards]);

  useEffect(() => {
    if (suspectComplete) {
      setSuspectDisabled(true);
    }
  }, [suspectComplete]);

  if (hasError && !suspecting) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
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
          <p>
            {errorMessage}
          </p>
          <CartasJugador cards={playerCards} />
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
          <p>
            {suspectMessage}
          </p>
          <CartasJugador cards={playerCards} />
        </Stack>
      </div>
    );
  }
  if(respondiendo){
    return(
      <RespuestaSospecha 
        idPartida={idPartida}
        idPlayer={idPlayer}
        suspectedCards={suspectedCards}
        idPlayerAsking={idPlayerAsking}
        setRespondiendo={setRespondiendo}
      />
    );
  }


  return (
    <div>
      <h2>Bienvenido a la Partida</h2>
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

    </div>
  );
}

export default Partida;