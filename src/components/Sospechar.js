import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import ElegirVictima from './ElegirCartas/ElegirVictima';
import ElegirMonstruo from './ElegirCartas/ElegirMonstruo';
import { victimsNames, monstersNames } from '../utils/constants';
import './Partida.css';
import { fetchRequest, fetchHandlerError } from '../utils/fetchHandler';

async function sendSuspect(idPartida, idPlayer, victima, monstruo) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      card1Name: victima,
      card2Name: monstruo,
    }),
  };
  const endpoint = `${process.env.REACT_APP_URL_SERVER}/${idPartida}/suspect/${idPlayer}`;

  return fetchRequest(endpoint, requestOptions);
}

function Sospechar(props) {
  const {
    setSuspecting, idPartida, idPlayer,
    setHasError, setErrorMessage, setSuspectComplete, suspecting, disabled,
  } = props;
  const [victima, setVictima] = useState('');
  const [monstruo, setMonstruo] = useState('');
  const [suspected, setSuspected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function suspect() {
      if (isMounted) {
        sendSuspect(idPartida, idPlayer, victimsNames[victima], monstersNames[monstruo])
          .then((response) => {
            switch (response.type) {
              case fetchHandlerError.SUCCESS:
                if (isMounted) {
                  setSuspectComplete(true);
                  setSuspecting(false);
                }
                break;
              case fetchHandlerError.REQUEST_ERROR:
                if (isMounted) {
                  setSuspected(false);
                  setSuspecting(false);
                  setErrorMessage(response.payload);
                  setHasError(true);
                }
                break;
              case fetchHandlerError.INTERNAL_ERROR:
                if (isMounted) {
                  setSuspected(false);
                  setSuspecting(false);
                  setErrorMessage(response.payload);
                  setHasError(true);
                }
                break;
              default:
                break;
            }
          });
      }
    }

    if (suspected) {
      suspect();
    }

    return () => {
      isMounted = false;
    };
  }, [suspected, idPartida, idPlayer, monstruo, victima, setSuspecting,
    setErrorMessage, setHasError, setSuspectComplete]);

  useEffect(() => {
    if (suspecting) {
      setHasError(false);
    }
  }, [suspecting, setHasError]);

  if (suspecting) {
    return (
      <div>
        <Stack alignItems="center">
          <ElegirVictima victima={victima} setVictima={setVictima} />
          <ElegirMonstruo monstruo={monstruo} setMonstruo={setMonstruo} />
          <Button
            variant="contained"
            onClick={() => setSuspected(true)}
          >
            Sospechar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setSuspecting(false);
              setVictima('');
              setMonstruo('');
            }}
            style={{ marginTop: '5px' }}
          >
            Volver
          </Button>
        </Stack>
      </div>
    );
  }
  if (disabled) {
    return (
      <div className="centeredButton">
        <Button
          variant="contained"
          disabled
        >
          Sospechar
        </Button>
      </div>
    );
  }

  return (
    <div className="centeredButton">
      <Button
        variant="contained"
        onClick={() => setSuspecting(true)}
      >
        Sospechar
      </Button>
    </div>
  );
}

export default Sospechar;
