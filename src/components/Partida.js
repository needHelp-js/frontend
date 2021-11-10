import React, { useEffect, useState } from "react";
import { Button } from '@mui/material';
import './Partida.css';


async function sendSuspect(idPartida, idPlayer, card1, card2){
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      card1Name: card1,
      card2Name: card2,
    }),
  };
  const endpointPrefix = process.env.REACT_APP_URL_SERVER;
  const endpoint = endpointPrefix.concat('/', idPartida, '/suspect/', idPlayer);

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
  const { idPartida, idPlayer, connectionSocket } = props.location.state;
  const [suspecting, setSuspecting] = useState(false);
  const [isTurn, setIsTurn] = useState(false);

  useEffect(() =>{
    console.log('en partida ws singleton:', connectionSocket.getInstance());
    connectionSocket.getInstance().onmessage = (event) =>{
      const message = JSON.parse(event.data);
        if (message.type === 'SUSPICION_MADE_EVENT') {
          console.log('se sospecho por:', message.payload.card1Name, message.payload.card2Name);
        }
    };
    async function getTurn(){
      getGameInfo(idPartida, idPlayer)
        .then((response) =>{
          console.log(response, idPlayer);
          if(response?.currentTurn == idPlayer){
            setIsTurn(true);
          }
        });
    }

    getTurn();

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

  if(isTurn){
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
  }else{
    return(
      <div>
        <h2>Bienvenido a la Partida</h2>
        <div className='suspectButton'>
          <Button 
          variant='contained'
          disabled
          onClick={() =>{setSuspecting(true);}}
          >
            Sospechar
          </Button>
        </div>
      </div>
    )
  }


}

export default Partida;