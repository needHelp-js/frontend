import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { TextField } from '@mui/material';
import ElegirNombrePartida from './ElegirNombrePartida';
import ElegirNickname from './ElegirNickname';

function InputCrearPartida(props) {
  const {
    nombrePartida,
    nickname,
    password,
    setNombrePartida,
    setNickname,
    setSubmited,
    setPassword,
  } = props;
  return (
    <div className="inputBox">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmited(true);
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <ElegirNombrePartida
            nombrePartida={nombrePartida}
            setNombrePartida={setNombrePartida}
          />
          <ElegirNickname nickname={nickname} setNickName={setNickname} />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Clave"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit" variant="contained">
            Crear
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default InputCrearPartida;
