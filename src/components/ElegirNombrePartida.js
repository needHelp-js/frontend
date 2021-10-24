import React, {useState } from 'react';
import Textfield from '@mui/material/TextField';
import { Button} from '@mui/material';
import Stack from '@mui/material/Stack'
import './inputs.css'

function ElegirNombrePartida({setTieneNombrePartida}) {
  
  const endpoint = 'http://127.0.0.1:5000/createGame';
  const [nombrePartida, setNombrePartida] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [responseID, setResponseID] = useState(0);
  
  function sendName(event){
    event.preventDefault();
    const requestOptions = {
      method : 'POST',
      headers : { 'Content-Type' : 'application/json'},
      body : JSON.stringify({
        title : "Nombre de la Partida",
        body : nombrePartida
      })
    };

    fetch(endpoint, requestOptions)
      .then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();
        if(!response.ok){
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        
        setResponseID(data[0].id);

      })
      .catch(error => {
        setErrorMessage(error.toString());
        console.error('Hubo un error:', errorMessage);
      });
      setTieneNombrePartida();
  }

  return(
    <div className="inputBox">
      <form onSubmit={sendName}>
        <Stack direction="row" alignItems="center" spacing={2}> 
          <Textfield 
            id="nombrePartida" 
            nombre="nombre" 
            label = "Nombre de la Partida"
            onChange={event => setNombrePartida(event.target.value)}
          />
          <Button type="submit" variant="contained">Crear</Button>
        </Stack>
      </form>
    </div>
  );
}

export default ElegirNombrePartida;