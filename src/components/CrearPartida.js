import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { URL_LOBBY } from '../routes';
import InputCrearPartida from './InputCrearPartida';
import './Main.css';

function handleValidate(nickname, nombrePartida) {
  if (nickname.length < 1) {
    return [false, 'El nickname debe tener al menos un caractér'];
  } if (nombrePartida.length < 1) {
    return [false, 'El nombre de la partida debe tener al menos un caractér'];
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
      const payload = isJson && await response.json();
      if (!response.ok) {
        const error = (payload && payload.Error) || response.status;
        return Promise.reject(error);
      }
      return payload;
    })
    .catch((error) => Promise.reject(error));
  return data;
}

const CrearPartida = (props) => {
  const [nombrePartida, setNombrePartida] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [validationFail, setValidationFail] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [creada, setCreada] = useState(false);
  const [idPartida, setIdPartida] = useState(0);
  const [idHost, setIdHost] = useState(0);
  const { endpoint } = props;

  useEffect(() => {
    let isMounted = true;
    async function sendData() {
      setHasError(false);
      const validate = handleValidate(nickname, nombrePartida);
      const validated = validate[0];
      const validationMessage = validate[1];
      if (!validated) {
        setErrorMessage(validationMessage);
        setValidationFail(true);
        setSubmited(false);
        setNickname('');
        setNombrePartida('');
        isMounted = false;
      } else {
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
            setSubmited(false);
            setNombrePartida('');
            setNickname('');
            isMounted = false;
          });
      }
    }
    if (submited) {
      sendData();
    }
    return () => {
      isMounted = false;
    };
  }, [submited, endpoint]);

  if (creada) {
    return (
      <Redirect to={{
        pathname: URL_LOBBY,
        state: {
          idPartida,
          idPlayer: idHost,
          nombrePartida,
          isHost: true,
        },
      }}
      />
    );
  }
  if (validationFail || hasError) {
    return (
      <div>
        <h1>
          Crear una Partida
        </h1>
        <InputCrearPartida
          nombrePartida={nombrePartida}
          nickname={nickname}
          setNombrePartida={setNombrePartida}
          setNickname={setNickname}
          setSubmited={setSubmited}
        />
        <p className="errorMessage">
          {errorMessage}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>
        Crear una Partida
      </h1>
      <InputCrearPartida
        nombrePartida={nombrePartida}
        nickname={nickname}
        setNombrePartida={setNombrePartida}
        setNickname={setNickname}
        setSubmited={setSubmited}
      />
    </div>
  );
};

export default CrearPartida;
