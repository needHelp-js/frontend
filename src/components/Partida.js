import React, { useEffect, useState } from 'react';
import CartasJugador from "./CartasJugador";
import SocketSingleton from './connectionSocket';

function Partida(props){
    const [playerCards, setPlayerCards] = useState([]);
    useEffect(() => {
        let isMounted = true;
        SocketSingleton.getInstance().addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
            if (message.type === 'DEAL_CARDS_EVENT' && isMounted) {
                setPlayerCards(message.payload);
                console.log(message);
            }
        });
        return () => {
            isMounted = false; 
        }
    }, [playerCards]);

    return(
        <div>
            <CartasJugador cards={playerCards}/>
        </div>
    )
}

export default Partida;