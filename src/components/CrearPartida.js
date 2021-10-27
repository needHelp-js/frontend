import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ElegirNombrePartida from './ElegirNombrePartida';
import ElegirNickname from './ElegirNickname';
import Lobby from './Lobby';
import './Opciones.css';

function handleValidate(nickname, nombrePartida) {
  console.log('saliendo por nickname', nickname.length, nickname);
  if (nickname.length < 2) {
    return [false, 'El nickname debe tener al menos dos caracteres'];
  } if (nombrePartida.length < 2) {
    return [false, 'El nombre de la partida debe tener al menos dos caracteres'];
  }
  return [true, ''];
}

async function sendGameData(endpoint, nickname, nombrePartida) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameName: nombrePartida,
      hostNickname: nickname,
    }),
  };

  const data = fetch(endpoint, requestOptions)
    .then(async (response) => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson && await response.json();
      if (!response.ok) {
        const error = (data && data.Error) || response.status;
        return Promise.reject(error);
      }
      return data;
    })
    .catch((error) => Promise.reject(error));
  return data;
}

const CrearPartida = (props) => {
  const [nombrePartida, setNombrePartida] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [creada, setCreada] = useState(false);
  const [idPartida, setIdPartida] = useState(0);
  const [idHost, setIdHost] = useState(0);
  const { endpoint } = props;

  useEffect(() => {
    let isMounted = true;
    console.log('1', nickname, nombrePartida);
    async function sendData() {
      setHasError(false);
      const validate = handleValidate(nickname, nombrePartida);
      const validated = validate[0];
      const validationMessage = validate[1];
      console.log('validationMesagge:', validationMessage);
      if (!validated) {
        console.log('input invalido');
        setErrorMessage(validationMessage);
        setHasError(true);
        isMounted = false;
      }
      sendGameData(endpoint, nickname, nombrePartida)
        .then(async (response) => {
          if (isMounted) {
            setIdPartida(response?.idPartida);
            setIdHost(response?.idHost);
            setSubmited(false);
            setCreada(true);
          }
        })
        .catch((error) => {
          setErrorMessage(error);
          setHasError(true);
        });
    }
    if (submited) {
      sendData();
    }
    return () => {
      isMounted = false;
    };
  }, [submited, endpoint, nickname, nombrePartida]);

  if (hasError) {
    return (
      <div>
        <p className="errorMessage">
          {errorMessage}
          {' '}
          , por favor recargue la pagina..
        </p>
      </div>
    );
  }
  if (creada) {
    return (
      <Lobby
        idPartida={idPartida}
        nombrePartida={nombrePartida}
        idHost={idHost}
        nicknameHost={nickname}
      />
    );
  }

  return (
    <div className="inputBox">
      <form onSubmit={(event) => {
        event.preventDefault();
        setSubmited(true);
      }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <ElegirNombrePartida
            setNombrePartida={setNombrePartida}
          />
          <ElegirNickname
            setNickName={setNickname}
          />
          <Button type="submit" variant="contained">
            Crear
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default CrearPartida;
