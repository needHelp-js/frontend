import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ElegirNombrePartida from './ElegirNombrePartida';
import ElegirNickname from './ElegirNickname';

function InputCrearPartida(props) {
  const { nombrePartida, nickname, setNombrePartida, setNickname, setSubmited } = props;
  return (
    <div className="inputBox">
      <form onSubmit={(event) => {
        event.preventDefault();
        setSubmited(true);
      }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <ElegirNombrePartida
            nombrePartida={nombrePartida}
            setNombrePartida={setNombrePartida}
          />
          <ElegirNickname
            nickname={nickname}
            setNickName={setNickname}
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
