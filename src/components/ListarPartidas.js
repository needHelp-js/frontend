import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Redirect } from 'react-router-dom';
import { URL_LOBBY } from '../routes';
import { fetchRequest, fetchHandlerError } from '../utils/fetchHandler';

async function getAPI(url) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  return fetchRequest(url, requestOptions);
}

async function patchAPI(url, payload) {
  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
  return fetchRequest(url, requestOptions);
}

function BotonUnirse(props) {
  const {
    disabled, idPartida, nickName, nombrePartida, password,
  } = props;
  const [idJugador, setIdJugador] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (clicked) {
        if (isMounted) {
          const response = await patchAPI(`${process.env.REACT_APP_URL_SERVER}/${idPartida}/join`,
            { playerNickname: nickName, password });
          switch (response.type) {
            case fetchHandlerError.SUCCESS:
              if (isMounted) {
                setIdJugador(response?.payload.playerId);
                setRedirect(true);
              }
              break;
            case fetchHandlerError.REQUEST_ERROR:
              alert(response.payload);
              break;
            case fetchHandlerError.INTERNAL_ERROR:
              alert(response.payload);
              break;
            default:
              break;
          }
          if (isMounted) setClicked(false);
        }
      }
    }
    fetchData();

    return (() => {
      isMounted = false;
    });
  }, [clicked, idPartida, nickName, password]);

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: URL_LOBBY,
          state: {
            idPartida,
            nombrePartida,
            idPlayer: idJugador,
          },
        }}
      />
    );
  }

  return (
    <div>
      <Button
        data-testid="unirse"
        disabled={disabled}
        color={disabled ? 'error' : 'primary'}
        variant="outlined"
        onClick={() => setClicked(true)}
      >
        Unirse
      </Button>
    </div>

  );
}

BotonUnirse.propTypes = {
  disabled: PropTypes.bool,
  idPartida: PropTypes.number,
  nickName: PropTypes.string,
  nombrePartida: PropTypes.string,
  password: PropTypes.string,
};

function mostrarFilas(disabled, nickName, password, rows) {
  if (rows) {
    if (rows.length > 0) {
      return (
        rows.map((row) => (
          <TableRow
            key={row.name}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.name ? row.name
                : undefined}
              {row.hasPassword ? ' (con contraseña)' : ' (sin contraseña)'}
            </TableCell>
            <TableCell align="right">
              {row.playerCount ? row.playerCount
                : undefined}
            </TableCell>
            <TableCell align="right">
              <BotonUnirse
                disabled={disabled}
                nickName={nickName}
                password={password}
                idPartida={row.id}
                nombrePartida={row.name}
              />
            </TableCell>
          </TableRow>
        ))
      );
    }

    return (
      <TableRow>
        <TableCell>
          No hay partidas.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>
        <ErrorIcon />
        Sin conexión, actualice la lista.
      </TableCell>
    </TableRow>
  );
}

function TablaPartidas(props) {
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const {
    url, disabled, nickName, password,
  } = props;

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (refresh) {
        const data = await getAPI(url);
        switch (data.type) {
          case fetchHandlerError.SUCCESS:
            if (isMounted) {
              setRows(data?.payload);
              setRefresh(false);
            }
            break;
          case fetchHandlerError.REQUEST_ERROR:
            setRows(data?.payload);
            break;
          case fetchHandlerError.INTERNAL_ERROR:
            setRows(data?.payload);
            break;
          default:
            break;
        }
      }
    }
    fetchData();

    return (() => {
      isMounted = false;
    });
  }, [refresh, url]);

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650 }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell>
              Nombre de la partida
            </TableCell>
            <TableCell align="right">
              Jugadores dentro
            </TableCell>
            <TableCell align="right">
              <Button
                variant="contained"
                endIcon={<RefreshIcon />}
                onClick={() => setRefresh(true)}
              >

                Actualizar
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mostrarFilas(disabled, nickName, password, rows)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

TablaPartidas.propTypes = {
  url: PropTypes.string,
};

const isAlphaNumeric = (str) => /^[a-z0-9]+$/gi.test(str);

function ListarPartidas(props) {
  const [nickName, setNickName] = useState('jugador');
  const [password, setPassword] = useState('');
  const [badNickName, setBadNickName] = useState(false);
  const { url } = props;

  useEffect(() => {
    if (isAlphaNumeric(nickName)) {
      setBadNickName(false);
    } else {
      setBadNickName(true);
    }
  }, [nickName]);

  return (
    <div style={{ margin: 50 }}>
      <TextField
        style={{ margin: 10 }}
        inputProps={{ 'aria-label': 'nickname' }}
        id="nickname"
        label="Nickname"
        defaultValue=""
        error={badNickName}
        onChange={(event) => setNickName(event.target.value)}
      />
      <TextField
        style={{ margin: 10 }}
        inputProps={{ 'aria-label': 'password' }}
        id="password"
        label="Contraseña"
        defaultValue=""
        onChange={(event) => setPassword(event.target.value)}
      />
      <TablaPartidas
        disabled={badNickName}
        url={url}
        nickName={nickName}
        password={password}
      />
    </div>
  );
}

ListarPartidas.propTypes = {
  url: PropTypes.string,
};

export default ListarPartidas;
