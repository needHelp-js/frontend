import './RespuestaDado.css';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import SocketSingleton from './connectionSocket';
import './Partida.css';

async function get(url) {
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

const diceRef = React.createRef();

async function rollDice(DadoUrl, setTirando) {
  get(DadoUrl)
    .then(() => {
      setTirando(false);
    })
    .catch((error) => {
      alert(error.Error);
    });
}

function toggleClasses(die) {
  die.classList.toggle('odd-roll');
  die.classList.toggle('even-roll');
}

function RespuestaDado(props) {
  const { DadoUrl } = props;
  const [tirando, setTirando] = useState(false);

  useEffect(() => {
    SocketSingleton.getInstance().addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'DICE_ROLL_EVENT') {
        console.log('ha tirado el dado', message?.payload);
        toggleClasses(diceRef.current);
        diceRef.current.setAttribute('data-roll', message?.payload);
      }
    });
  }, [tirando]);

  return (

    <div>
      <div className="centeredButton">
        <Button          
          onClick={() => {
            rollDice(DadoUrl, setTirando);
            setTirando(true);
          }}
          variant="contained"
        >
          Tirar Dado
        </Button>

      </div>

      <div className="dice">
        <ol className="die-list even-roll" data-roll="1" id="die-1" ref={diceRef}>
          <li className="die-item" data-side="1">
            <span className="dot" />
          </li>
          <li className="die-item" data-side="2">
            <span className="dot" />
            <span className="dot" />
          </li>
          <li className="die-item" data-side="3">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </li>
          <li className="die-item" data-side="4">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </li>
          <li className="die-item" data-side="5">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </li>
          <li className="die-item" data-side="6">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </li>
        </ol>
      </div>
    </div>

  );
}

export default RespuestaDado;
