import React from "react";
import MostrarJugadores from "./MostrarJugadores";

function Partida(){
    return(
        <div>
            <h2>Bienvenido a la Partida</h2>
        
            <h2>
                {nombrePartida}
            </h2>
            <h4>Jugadores en la partida:</h4>
            <MostrarJugadores
                playerJoined={playerJoined}
                setPlayerJoined={setPlayerJoined}
                idPartida={idPartida}
            />
        </div>
        
    )
}

export default Partida;