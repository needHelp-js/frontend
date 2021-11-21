import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import SocketSingleton from './connectionSocket';
import './Partida.css';
import Sospechar from './Sospechar/Sospechar';
import RespuestaDado from './RespuestaDado';

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
        </Stack>
      </div>
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
      </Stack>
    </div>
  );
}

export default Partida;
