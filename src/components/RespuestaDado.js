import './RespuestaDado.css';
import Button from '@mui/material/Button';
import React, {useEffect, useState, createRef} from 'react';
import {SocketSingleton} from './connectionSocket'



async function get(url){

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };
      const data = fetch(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const payload = isJson && await response.json();
            const error = (payload) || response.status;
            return Promise.reject(error);
          }
          return '';
        })
        .catch((error) => Promise.reject(error));
      return data;
}



let diceRef = React.createRef();


async function rollDice(DadoUrl, setTirando) { 
    get(DadoUrl)
    .then(() => {
        setTirando(false);
    })
    .catch((error) => {
        console.error(error);
    });
  
}
  
  function toggleClasses(die) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }

function RespuestaDado(props){

    const { DadoUrl, dado,  tirando, setTirando, tiroCompleto } = props;


    useEffect(() => {
      if(tirando){
        rollDice(DadoUrl, setTirando)
      }
    }, [tirando]);

    useEffect(() => {
      if(tiroCompleto){
        toggleClasses(diceRef.current);
        diceRef.current.setAttribute("data-roll", dado);
      }
    }, [tiroCompleto]);

    return(
    
    <div>
        <div className="dice">
            <ol className="die-list even-roll" data-roll="1" id="die-1" ref={diceRef}>
                <li className="die-item" data-side="1">
                    <span className="dot"></span>
                </li>
                <li className="die-item" data-side="2">
                    <span className="dot"></span>
                    <span className="dot"></span>
                </li>
                <li className="die-item" data-side="3">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </li>
                <li className="die-item" data-side="4">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </li>
                <li className="die-item" data-side="5">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </li>
                <li className="die-item" data-side="6">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </li>
            </ol>
        </div>
    </div>

    );
}


export default RespuestaDado;

