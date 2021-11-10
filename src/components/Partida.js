import React, { useEffect, useState } from "react";
import { Button } from '@mui/material';
import SocketSingleton from "./connectionSocket";
import './Partida.css';



async function getGameInfo(idPartida, idPlayer) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const endpoint = process.env.REACT_APP_URL_SERVER.concat(
    '/', idPartida, '?gameId=', idPartida, '&playerId=', idPlayer);
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

function Partida(props){
  const { idPartida, idPlayer } = props.location.state;
  const [suspecting, setSuspecting] = useState(false);
  const [victima, setVictima] = useState('');

  useEffect(() =>{
    console.log('en partida ws singleton:', SocketSingleton.getInstance());
    SocketSingleton.getInstance().onmessage = (event) =>{
      const message = JSON.parse(event.data);
        if (message.type === 'SUSPICION_MADE_EVENT') {
          console.log('se sospecho por:', message.payload.card1Name, message.payload.card2Name);
        }
    };
  },[]);

  useEffect(() =>{
    async function suspect(){
      sendSuspect(idPartida, idPlayer,"Conde","Momia")
        .then(() =>{
          setSuspecting(false);
        });
    }

    if(suspecting){
      suspect();
    }
  },[suspecting]);

  function elegir(victimaImg){
    setVictima(victimaImg);
    console.log('elegimos vistima', victima, victimaImg);
  }

  return(
    <div>
      <h2>Bienvenido a la Partida</h2>
        <div className='suspectButton'>
          <Button 
          variant='contained'
          onClick={() =>{setSuspecting(true);}}
          >
            Sospechar
          </Button>
        </div>
    </div>
  )


}

export default Partida;