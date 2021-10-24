import React, { useState } from 'react';
import Textfield from '@mui/material/TextField';
import { Button} from '@mui/material';
import Stack from '@mui/material/Stack'
import './inputs.css'

function ElegirNickname() {
  
  const endpoint = 'http://127.0.0.1:5000/chooseNickname';
  const [nickName, setNickName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [responseID, setResponseID] = useState(0);

  function sendNickName(event){
    event.preventDefault();
    const requestOptions = {
      method : 'POST',
      headers : { 'Content-Type' : 'application/json'},
      body : JSON.stringify({
        title : "Nombre del Jugador",
        body : nickName
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
  }

  return(
    <div className="inputBox">
      <form onSubmit={sendNickName}>
        <Stack direction="row" alignItems="center" spacing={2}> 
          <Textfield 
          id="nickname"
          name="nickname" 
          label = "Nickname"
          onChange={event => setNickName(event.target.value)}
          />
          <Button type="submit" variant="contained">Elegir</Button>
        </Stack>
      </form>
    </div>
  );
}

export default ElegirNickname;