import React, { useEffect, useState } from 'react';
import SocketSingleton  from './connectionSocket';
import './Partida.css';
import Sospechar from './Sospechar/Sospechar';
import RespuestaDado from './RespuestaDado';
import {fetchRequest, fetchHandlerError} from '../utils/fetchHandler'

async function getGameInfo(idPartida, idPlayer) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const endpoint = `${process.env.REACT_APP_URL_SERVER}'/'${idPartida}`;
  const params = {
    gameId: idPartida,
    playerId: idPlayer,
  }
  fetchRequest(endpoint, requestOptions, params);
}

function Partida(props) {
  const { idPartida, idPlayer } = props.location.state;
  const [suspecting, setSuspecting] = useState(false);
  const [suspectDisabled, setSuspectDisabled] = useState(false);
  const [suspectComplete, setSuspectComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suspectMessage, setSuspectMessage] = useState('');
  const urlDado = `${process.env.REACT_APP_URL_SERVER}/${idPartida}/dice/${idPlayer}`;


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
  }, []);

  useEffect(() => {
    if (suspectComplete) {
      setSuspectDisabled(true);
    }
  }, [suspectComplete]);

  if (hasError && !suspecting) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
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
      </div>
    );
  }

  if (suspectComplete) {
    return (
      <div>
        <h2>Bienvenido a la Partida</h2>
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
      </div>
    );
  }

  return (
    <div>
      <h2>Bienvenido a la Partida</h2>
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
    </div>
  );
}

export default Partida;

