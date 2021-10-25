import React, { useEffect, useState } from 'react';
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

const OpcionCrearPartida = (props) =>{

  const [creando, setCreando] = useState(false);
  const [nombrePartida, setNombrePartida] = useState("");
  const [nickName, setNickName] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseID, setResponseID] = useState(0);
  const endpoint = props.endpoint;

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
        setError(true);
      })
  }

  useEffect(() => {
    return function () { //cleanup function
      setErrorMessage("");
    }
  })
  
  if(error){
    return(
      <div>
        <p className="errorMessage"> 
          Hubo un error, por favor recargue la pagina..
        </p>
      </div>
    );
  }
  
  if(creando){
      return (
        <div className='inputBox'>
          <form onSubmit={sendGameData}>
            <Stack direction="row" alignItems="center" spacing={2}> 
              <ElegirNombrePartida 
                setNombrePartida={setNombrePartida}
              />
              <ElegirNickname
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