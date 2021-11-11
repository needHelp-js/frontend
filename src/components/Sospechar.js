import React, { useState, useEffect } from "react";
import { Button } from '@mui/material';
import ElegirVictima from "./ElegirVictima";
import ElegirMonstruo from "./ElegirMonstruo";

async function sendSuspect(idPartida, idPlayer, victima, monstruo){
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      card1Name: victima,
      card2Name: monstruo,
    }),
  };

  const endpoint = process.env.REACT_APP_URL_SERVER.concat('/', idPartida, '/suspect/', idPlayer);

  const data = fetch(endpoint, requestOptions)
    .then(async (response) => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const payload = isJson && await response.json();
      if (!response.ok) {
        const error = (payload && payload.Error) || response.status;
        return Promise.reject(error);
      }
      return payload;
    })
    .catch((error) => Promise.reject(error));
  return data;

}


function Sospechar(props){
  const { setSuspecting, idPartida, idPlayer } = props;
  const [victima, setVictima] = useState('');
  const [monstruo, setMonstruo] = useState('');
  const [suspected, setSuspected] = useState(false);


  useEffect(() =>{
    async function suspect(){
      sendSuspect(idPartida, idPlayer, victima, monstruo)
        .then(() =>{
          setSuspecting(false);
        });
    }

    if(suspected){
      suspect();
    }
  },[suspected]);

  return(
    <div>
      <ElegirVictima victima={victima} setVictima={setVictima}/>
      <ElegirMonstruo monstruo={monstruo} setMonstruo={setMonstruo}/>
      <Button 
        variant='contained'
        onClick={() => setSuspected(true)}
      >
        Sospechar
      </Button>

    </div>
  );

}

export default Sospechar;