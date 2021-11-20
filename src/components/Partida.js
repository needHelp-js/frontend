import React, { useEffect, useState } from "react";
import { Button } from '@mui/material';
import {SocketSingleton} from './connectionSocket';
import './Partida.css';
import RespuestaDado from './RespuestaDado';



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

  useEffect(() =>{
    console.log('en partida ws singleton:', SocketSingleton.getInstance());
    SocketSingleton.getInstance().onmessage = (event) =>{
      const message = JSON.parse(event.data);
        if (message.type === 'SUSPICION_MADE_EVENT') {
          console.log('se sospecho por:', message.payload.card1Name, message.payload.card2Name);
        }
    };
  },[]);


const url = 'http://localhost:8000/games/'.concat(idPartida,'/dice/', idPlayer);

  return(
    <div>
      <h2>Bienvenido a la Partida</h2>
      <RespuestaDado DadoUrl={url}/>
    </div>
  )


}

export default Partida;