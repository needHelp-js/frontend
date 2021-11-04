import './RespuestaDado.css';
import Button from '@mui/material/Button';
import React, {useEffect, useState, createRef} from 'react';


async function get(url){

    try {
        const response = await fetch(url, {
            headers: {"Content-Type": "application/json"}
        });

        const json = await response.json();
        if(!response.ok){
            alert(json.Error);
        }
        return json;

    } catch (error){
        console.log(error);
    }

}


const DadoUrl = 'http://localhost:8000/games/5/dice/10';


let diceRef = React.createRef();


async function rollDice() {
    await get(DadoUrl);
  
}
  
  function toggleClasses(die) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }

function RespuestaDado(){

    const socketURL = 'ws://localhost:8000/games/5/ws/10';
    const [player, setPlayer] = useState(false);
    const playerSocket = createRef();
    
    useEffect(() => {
        playerSocket.current = new WebSocket(socketURL);
        setPlayer(true);

        playerSocket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            if(message.type === 'DICE_ROLL_EVENT') {
                console.log('ha tirado el dado', message?.payload.playerNickname);
                toggleClasses(diceRef.current);
                diceRef.current.setAttribute("data-roll", message.payload);
                setPlayer(true);
            }
        };
 
    }, [socketURL]);
    
    return(
    
    <div>
        
       
        <Button

        onClick = {rollDice}

    

        variant="contained"

        >
            Tirar Dado

        </Button> 
        
        <div class="dice">
            <ol class="die-list even-roll" data-roll="1" id="die-1" ref={diceRef}>
                <li class="die-item" data-side="1">
                    <span class="dot"></span>
                </li>
                <li class="die-item" data-side="2">
                    <span class="dot"></span>
                    <span class="dot"></span>
                </li>
                <li class="die-item" data-side="3">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </li>
                <li class="die-item" data-side="4">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </li>
                <li class="die-item" data-side="5">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </li>
                <li class="die-item" data-side="6">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </li>
            </ol>
        </div>
    </div>

    );
}


export default RespuestaDado;

