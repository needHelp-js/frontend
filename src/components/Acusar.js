import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import ElegirVictima from './ElegirCartas/ElegirVictima';
import ElegirMonstruo from './ElegirCartas/ElegirMonstruo';
import ElegirRecinto from './ElegirCartas/ElegirRecinto';
import { fetchRequest, fetchHandlerError } from '../utils/fetchHandler';
import {
  victimsNames, monstersNames, roomsNames, accusationState,
} from '../utils/constants';

function sendAccusationData(idPartida, idPlayer, monstruo, recinto, victima) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      victimCardName: victima,
      monsterCardName: monstruo,
      roomCardName: recinto,
    }),
  };
  const endpoint = `${process.env.REACT_APP_URL_SERVER}/${idPartida}/accuse/${idPlayer}`;

  return fetchRequest(endpoint, requestOptions);
}

function Acusar(props) {
  const {
    setAccusationStage,
    setHasError,
    setErrorMessage,
    idPartida,
    idPlayer,
  } = props;

  const [victima, setVictima] = useState('');
  const [monstruo, setMonstruo] = useState('');
  const [recinto, setRecinto] = useState('');
  const [accused, setAccused] = useState(false);
  useEffect(() => {
    let isMounted = true;

    if (accused && isMounted) {
      sendAccusationData(
        idPartida,
        idPlayer,
        monstersNames[monstruo],
        roomsNames[recinto],
        victimsNames[victima],
      ).then((response) => {
        switch (response?.type) {
          case fetchHandlerError.SUCCESS:
            setAccusationStage(accusationState.WAITING_FOR_ACCUSATION_RESPONSE);
            break;
          case fetchHandlerError.REQUEST_ERROR:
          case fetchHandlerError.INTERNAL_ERROR:
            setHasError(true);
            setErrorMessage(response.payload);
            setAccusationStage(accusationState.NOT_ACCUSING);
            break;
          default:
            break;
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [accused]);

  return (
    <div style={{ display: 'flex' }}>
      <Stack alignItems="center">
        <ElegirVictima victima={victima} setVictima={setVictima} />
        <ElegirMonstruo monstruo={monstruo} setMonstruo={setMonstruo} />
        <ElegirRecinto recinto={recinto} setRecinto={setRecinto} />
      </Stack>
      <Stack style={{ marginTop: '1rem' }}>
        <Button variant="contained" onClick={() => setAccused(true)}>
          Acusar
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setAccusationStage(accusationState.NOT_ACCUSING);
            setVictima('');
            setMonstruo('');
            setRecinto('');
          }}
          style={{ marginTop: '5px' }}
        >
          Volver
        </Button>
      </Stack>
    </div>
  );
}

export default Acusar;
