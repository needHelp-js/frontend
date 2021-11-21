import React, { useEffect, useState } from 'react';
import CartasJugador from './CartasJugador';
import SocketSingleton from './connectionSocket';
import './Partida.css';
import RespuestaDado from './RespuestaDado';

function Partida(props) {
  const { location } = props;
  const { idPartida, idPlayer } = location;
  const [playerCards, setPlayerCards] = useState([]);

  useEffect(() => {
    let isMounted = true;
    SocketSingleton.getInstance().addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'SUSPICION_MADE_EVENT') {
        console.log('se sospecho por:', message.payload.card1Name, message.payload.card2Name);
      } else if (message.type === 'DEAL_CARDS_EVENT' && isMounted) {
        setPlayerCards(message.payload);
        console.log(message);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [playerCards]);

  const url = process.env.REACT_APP_URL_SERVER.concat(idPartida, '/dice/', idPlayer);

  return (
    <div>
      <h2>Bienvenido a la Partida</h2>
      <RespuestaDado DadoUrl={url} />
      <CartasJugador cards={playerCards} />
    </div>
  );
}

export default Partida;
