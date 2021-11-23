import React, { useEffect, useState } from "react";
import SocketSingleton from './connectionSocket';
import './Partida.css';
import RespuestaDado from './RespuestaDado';
import MostrarJugadores from "./MostrarJugadores";
import { fetchRequest, fetchHandlerError } from "../utils/fetchHandler";



async function getGameInfo(idPartida, idPlayer) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const endpoint = process.env.REACT_APP_URL_SERVER.concat('/', idPartida);
  return fetchRequest(endpoint, requestOptions, { playerId: idPlayer});
}

function Partida(props){
  const { idPartida, idPlayer } = props.location.state;
  const [playerList, setPlayerList] = useState([]);

  useEffect(() =>{
    console.log('en partida ws singleton:', SocketSingleton.getInstance());
    SocketSingleton.getInstance().onmessage = (event) =>{
      const message = JSON.parse(event.data);
        if (message.type === 'SUSPICION_MADE_EVENT') {
          console.log('se sospecho por:', message.payload.card1Name, message.payload.card2Name);
        }
    };
    let isMounted = true;
    getGameInfo(idPartida, idPlayer).then(async (response) => {
      if (response.type === fetchHandlerError.SUCCESS){
        if(isMounted){
          setPlayerList(response?.payload.players);
        }
      }
    })
    return() => {
      isMounted = false;
    }
    
  },[]);


const url = 'http://localhost:8000/games/'.concat(idPartida,'/dice/', idPlayer);

  return(
    <div>
      <h2>Bienvenido a la Partida</h2>
      <RespuestaDado DadoUrl={url}/>
      <MostrarJugadores playerList={playerList}
      />
    </div>
  )

}


export default Partida;