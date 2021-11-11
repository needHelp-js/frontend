import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import ElegirVictima from './ElegirVictima';
import ElegirMonstruo from './ElegirMonstruo';

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
        const error = (payload && payload.Error) || response.status;
        return Promise.reject(error);
      }
      return '';
    })
    .catch((error) => Promise.reject(error));
  return data;
}

function Sospechar(props) {
  const {
    suspected, setSuspected, setSuspecting, idPartida, idPlayer,
  } = props;
  const [victima, setVictima] = useState('');
  const [monstruo, setMonstruo] = useState('');

  useEffect(() => {
    async function suspect() {
      sendSuspect(idPartida, idPlayer, victima, monstruo)
        .then(() => {
          setSuspecting(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    if (suspected) {
      suspect();
    }
  }, [suspected]);

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

export default Sospechar;
