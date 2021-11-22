import React, { useEffect, useState } from 'react';
import Card from './Carta'
import { fetchRequest, fetchHandlerError } from '../utils/fetchHandler';
import SocketSingleton from './connectionSocket';
import {Button, Stack} from '@mui/material'
import './Partida.css'


async function sendAnswerData(idPartida, idPlayer, idPlayerAsking, card){
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      replyToPlayerId: idPlayerAsking,
      cardName: card,
    }),
  };
  const endpoint = `${process.env.REACT_APP_URL_SERVER}/${idPartida}/replySuspect/${idPlayer}`;
  const params = {
    playerId: idPlayer
  };

  return fetchRequest(endpoint, requestOptions, params);
}



function RespuestaSospecha(props){
  const { idPartida, idPlayer, idPlayerAsking, suspectedCards,
    setRespondiendo, mostrandoRespuesta, setMostrandoRespuesta, cartaRespuesta} = props;

  const [respuesta, setRespuesta] = useState('');
  const [newSelected, setNewSelected] = useState('');
  const [respondido, setRespondido] = useState(false);

  function handleClick(id) {
    setNewSelected(id);
    const img = document.getElementById(id);
    img.className = 'selectedCard';
  }

  useEffect(() => {
    if (respuesta !== newSelected && respuesta === '') {
      setRespuesta(newSelected);
    } else if (respuesta !== newSelected && respuesta !== '') {
      document.getElementById(respuesta).className = 'optionCard';
      setRespuesta(newSelected);
    }
  }, [newSelected, setRespuesta]);

  useEffect(() => {
    let isMounted = true;
    async function sendAnswer(){
      sendAnswerData(idPartida, idPlayer, idPlayerAsking, respuesta)
      .then((response) =>{
        switch (response.type){
          case fetchHandlerError.SUCCESS:
            setRespondiendo(false);
            break;
          case fetchHandlerError.REQUEST_ERROR:
            alert(response.payload);
            break;
          case fetchHandlerError.INTERNAL_ERROR:
            alert(response.payload);
            break;
        }
        
      });


    }

    if(respondido) sendAnswer();

  },[respondido]);

  useEffect(() =>{
    if(!mostrandoRespuesta) console.log('dejamos de mostrar respuesta');
    
  },[mostrandoRespuesta])
  
  if(mostrandoRespuesta){
    console.log('mostramos')
    return(
      <div>
        <h2>
          Una Respuesta !
        </h2>
        <p>
          Han respondido a su sospecha con:
        </p>
        <div className="centeredButton">
          <Card 
            id={cartaRespuesta}
            key={cartaRespuesta}
            cardName={cartaRespuesta}
            onClick={() => {}}
          />
          <Button
            variant="contained"
            onClick={() => setMostrandoRespuesta(false)}
          >
            OK
          </Button>
        </div>
      </div>
    );
  }
  



  const suspectedElems = suspectedCards.map((elem) => (
    <Card 
      id={elem}
      key={elem}
      cardName={elem}
      onClick={() => handleClick(elem)}
    />
  ));

  return(
    <div>
      <h2>
        Una sospecha !
      </h2>
      <p>
        Tiene que responder sobre las siguientes cartas:
      </p>
      <Stack direction="row" alignItems="center" spacing={2}>
        {suspectedElems}
      </Stack>
      <div className="centeredButton">
        <Button
          variant="contained"
          onClick={() => setRespondido(true)}
        >
          Responder
        </Button>
      </div>
    </div>
  );
}

export default RespuestaSospecha;