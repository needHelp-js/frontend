import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { URL_LOBBY } from '../../routes';
import InputCrearPartida from './InputCrearPartida';
import '../Main.css';
import { fetchRequest, fetchHandlerError } from '../../utils/fetchHandler';

function handleValidate(nickname, nombrePartida) {
  if (nickname.length < 1) {
    return [false, 'El nickname debe tener al menos un caractér'];
  } if (nombrePartida.length < 1) {
    return [false, 'El nombre de la partida debe tener al menos un caractér'];
  }
  return [true, ''];
}

async function sendGameData(endpoint, nickname, nombrePartida, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameName: nombrePartida,
      hostNickname: nickname,
      password,
    }),
  };

  return fetchRequest(endpoint, requestOptions);
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
  const [password, setPassword] = useState('');
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
        sendGameData(endpoint, nickname, nombrePartida, password)
          .then(async (response) => {
            switch (response.type) {
              case fetchHandlerError.SUCCESS:
                if (isMounted) {
                  setIdPartida(response?.payload.idPartida);
                  setIdHost(response?.payload.idHost);
                  setSubmited(false);
                  setCreada(true);
                }
                break;
              case fetchHandlerError.REQUEST_ERROR:
                setErrorMessage(response.payload);
                setHasError(true);
                setSubmited(false);
                setNombrePartida('');
                setNickname('');
                setPassword('');
                isMounted = false;
                break;
              case fetchHandlerError.INTERNAL_ERROR:
                setErrorMessage(response.payload);
                setHasError(true);
                setSubmited(false);
                setNombrePartida('');
                setNickname('');
                setPassword('');
                isMounted = false;
                break;
              default:
                break;
            }
          });
      }
    }
    if (submited) {
      sendData();
    }
    return () => {
      isMounted = false;
    };
  }, [submited, endpoint, nickname, nombrePartida, password]);

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
          password={password}
          setNombrePartida={setNombrePartida}
          setNickname={setNickname}
          setSubmited={setSubmited}
          setPassword={setPassword}
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
        password={password}
        setNombrePartida={setNombrePartida}
        setNickname={setNickname}
        setPassword={setPassword}
        setSubmited={setSubmited}
      />
    </div>
  );
};

export default CrearPartida;
