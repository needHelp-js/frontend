import './RespuestaDado.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';


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


// Botón para tirar el dado si es el turno del jugador 

/* Mostrar el resultado */

function RespuestaDado(){

    const [dado, setDado ] = useState(1);

    const [click, setClick] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (click) {
                const data = await get(DadoUrl);
                setDado(data.resultado);
                setClick(false);
            }
        }
        fetchData();
    }, [click]);

    return(
    <div>
        
        <Button

        onClick={()=>
            
            setClick(true)
        
        }

        variant="contained"

        >
            Tirar Dado

        </Button>

        <p>{dado}</p>

    </div>

    );
}


export default RespuestaDado;

