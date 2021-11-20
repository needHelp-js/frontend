import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import ElegirVictima from './ElegirVictima';
import ElegirMonstruo from './ElegirMonstruo';
import '../Partida.css';

async function sendSuspect(idPartida, idPlayer, victima, monstruo) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      card1Name: victima,
      card2Name: monstruo,
    }),
  };

  const endpoint = process.env.REACT_APP_URL_SERVER.concat('/', idPartida, '/suspect/', idPlayer);

  const data = fetch(endpoint, requestOptions)
    .then(async (response) => {
      if (!response.ok) {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const payload = isJson && await response.json();
        const error = (payload.Error) || response.status;
        return Promise.reject(error);
      }
      return '';
    })
    .catch((error) => Promise.reject(error));
  return data;
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
    async function suspect() {
      sendSuspect(idPartida, idPlayer, victima, monstruo)
        .then(() => {
          setSuspectComplete(true);
          setSuspecting(false);
        })
        .catch((error) => {
          setSuspected(false);
          setSuspecting(false);
          setErrorMessage(error);
          console.error(error);
          setHasError(true);
        });
    }

    if (suspected) {
      suspect();
    }
  }, [suspected]);

  useEffect(() => {
    if (suspecting) {
      setHasError(false);
    }
  }, [suspecting]);

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
        </Stack>
      </div>
    );
  }
  if (disabled) {
    return (
      <div className="suspectButton">
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
    <div className="suspectButton">
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
