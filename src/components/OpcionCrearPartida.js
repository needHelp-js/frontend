import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack'
import './OpcionCrearPartida.css';
import ElegirNombrePartida from './ElegirNombrePartida';
import ElegirNickname from './ElegirNickname';

const BotonOpcionCrearPartida = ({setCreando}) => {

    return(
      <div className="botonOpcionCrearPartida">
          <Button 
          variant="contained" 
          onClick={setCreando}>
            Crear una partida 
          </Button>
      </div>
    );
}

const OpcionCrearPartida = () =>{

    const [creando, setCreando] = useState(false);
    const [nombrePartida, setNombrePartida] = useState("");
    const [nickName, setNickName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [responseID, setResponseID] = useState(0);
    const endpoint = 'http://127.0.0.1:5000/createGame';

    function sendGameData(event){
      event.preventDefault();
      const requestOptions = {
        method : 'POST',
        headers : { 'Content-Type' : 'application/json'},
        body : JSON.stringify({
          gameName : nombrePartida,
          hostNickName : nickName
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


  
    if(creando){
        return (
          <div className='inputBox'>
            <form onSubmit={sendGameData}>
              <Stack direction="row" alignItems="center" spacing={2}> 
                <ElegirNombrePartida 
                  nombrePartida={nombrePartida}
                  setNombrePartida={setNombrePartida}
                />
                <ElegirNickname
                  nickName={nickName}
                  setNickName={setNickName}
                />
                <Button type="submit" variant="contained">
                  Crear
                </Button>
              </Stack>
            </form>
          </div>
        );
    }else{
      return <BotonOpcionCrearPartida setCreando={() => setCreando(true)}/>;
    }
}

export default OpcionCrearPartida