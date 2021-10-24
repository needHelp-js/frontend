import Textfield from '@mui/material/TextField';

function ElegirNombrePartida(props) {

  return(
    <Textfield 
      id="nombrePartida" 
      nombre="nombre" 
      label = "Nombre de la Partida"
      onChange={event => props.setNombrePartida(event.target.value)}
    />
  );
}

export default ElegirNombrePartida;