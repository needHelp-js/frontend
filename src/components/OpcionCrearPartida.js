import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import './Opciones.css';
import ElegirNombrePartida from './ElegirNombrePartida';
import ElegirNickname from './ElegirNickname';



const OpcionCrearPartida = (props) => {
  
  const [nombrePartida, setNombrePartida] = useState('');
  const [nickName, setNickName] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { endpoint } = props;

  function sendGameData(event) {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameName: nombrePartida,
        hostNickname: nickName,
      }),
    };

    fetch(endpoint, requestOptions)
      .then(async (response) => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        return null;
      })
      .catch((error) => {
        setErrorMessage(error.toString());
        console.error('Hubo un error:', errorMessage);
        setHasError(true);
      });
  }

  useEffect(() => function cleanup() { // cleanup function
    setErrorMessage('');
  });

  if (hasError) {
    return (
      <div>
        <p className="errorMessage">
          Hubo un error, por favor recargue la pagina..
        </p>
      </div>
    );
  }

    return (
      <div className="inputBox">
        <form onSubmit={sendGameData}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ElegirNombrePartida
              setNombrePartida={setNombrePartida}
            />
            <ElegirNickname
              setNickName={setNickName}
            />
            <Button type="submit" variant="contained">
              Crear
            </Button>
          </Stack>
        </form>
      </div>
    );
};

export default OpcionCrearPartida;
