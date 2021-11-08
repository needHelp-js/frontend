import React from 'react';
import Textfield from '@mui/material/TextField';

function ElegirNombrePartida(props) {
  const { nombrePartida } = props;
  return (
    <Textfield
      id="nombrePartida"
      nombre="nombre"
      label="Nombre de la Partida"
      value={nombrePartida}
      onChange={(event) => props.setNombrePartida(event.target.value)}
    />
  );
}

export default ElegirNombrePartida;
