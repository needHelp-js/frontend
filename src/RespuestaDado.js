import './RespuestaDado.css';
import * as React from 'react';
import Button from '@mui/material/Button';


async function get(url){

    try {
        const response = await fetch(url, {
            headers: {"Content-Type": "application/json"}
        });

        const json = await response.json();
        return json;

    } catch (error) {
        console.log(error);
    }

}


const DadoUrl = 'http://127.0.0.1:5000/dado';


let diceRef = React.createRef();


async function rollDice() {
    const num = await get(DadoUrl);
    toggleClasses(diceRef.current);
    diceRef.current.setAttribute("data-roll", num.resultado);
}
  
  function toggleClasses(die) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }

function RespuestaDado(){
    
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

