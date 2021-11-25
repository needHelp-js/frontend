import React, { useEffect, useRef, useState } from 'react';
import useMouse from '@react-hook/mouse-position';
import spriteCochera from '../sprites/spriteCochera.png';
import spriteVestibulo from '../sprites/spriteVestibulo.png';
import spriteBodega from '../sprites/spriteBodega.png';
import spriteAlcoba from '../sprites/spriteAlcoba.png';
import spriteMisterio from '../sprites/spriteMisterio.png';
import spriteSalon from '../sprites/spriteSalon.png';
import spriteBiblioteca from '../sprites/spriteBiblioteca.png';
import spritePanteon from '../sprites/spritePanteon.png';
import spriteLaboratorio from '../sprites/spriteLaboratorio.png';
import spriteEntradaIzqAzul from '../sprites/spriteEntradaIzqAzul.jpg';
import spriteEntradaDerAzul from '../sprites/spriteEntradaDerAzul.jpg';
import spriteEntradaIzqMarron from '../sprites/spriteEntradaIzqMarron.jpg';
import spriteEntradaDerMarron from '../sprites/spriteEntradaDerMarron.jpg';
import spriteEntradaArribaMarron from '../sprites/spriteEntradaArribaMarron.jpg';
import spriteEntradaAbajoMarron from '../sprites/spriteEntradaAbajoMarron.jpg';
import spriteCobra from '../sprites/spriteCobra.jpg';
import spriteSpider from '../sprites/spriteSpider.jpg';
import spriteMurcielago from '../sprites/spriteMurcielago.jpg';
import spriteEscorpion from '../sprites/spriteEscorpion.jpg';
import spriteTrampa from '../sprites/spriteTrampa.jpg';
import PropTypes from 'prop-types';

function arrayEquals(a, b) {
  return Array.isArray(a)
      && Array.isArray(b)
      && a.length === b.length
      && a.every((val, index) => val === b[index]);
}

async function patchAPI(url, payload) {
  try {
    const response = await fetch(url, {
      body: payload,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });

    const json = await response.json();
    const status = await response.status;
    return [json, status];
  } catch (error) {
    return [null, null];
  }
}

const widthTablero = 640;
const heightTablero = 640;
const centerY = 10;
const centerX = 10;
const cantidadCasilleros = 20;
const casilleroSize = widthTablero / cantidadCasilleros;
const recintoSize = 191;

const getPixelRatio = (ctx) => {
  const backingStore = ctx.backingStorePixelRatio
  || ctx.webkitBackingStorePixelRatio
  || ctx.mozBackingStorePixelRatio
  || ctx.msBackingStorePixelRatio
  || ctx.oBackingStorePixelRatio
  || ctx.backingStorePixelRatio
  || 1;

  return (window.devicePixelRatio || 1) / backingStore;
};

function dibujarCasilleroVacio(ctx, i, j) {
  ctx.rect(centerX + j * casilleroSize, centerY + i * casilleroSize,
    casilleroSize, casilleroSize);
  ctx.strokeStyle = 'white';
  ctx.stroke();
}

function dibujarCasilleroClickeado(ctx, i, j) {
  ctx.fillStyle = 'white';
  ctx.fillRect(centerX + j * casilleroSize, centerY + i * casilleroSize,
    casilleroSize, casilleroSize);
}

function dibujarCasilleroDisponible(ctx, i, j) {
  ctx.fillStyle = "rgba(0, 100, 0, 0.5)";
  ctx.fillRect(centerX + j * casilleroSize, centerY + i * casilleroSize,
    casilleroSize, casilleroSize);
}

function dibujarCasillerosDisponibles(ctx, availablePositions) {
  for (let i = 0; i < availablePositions.length; i++) {
    const pos = availablePositions[i];
    const posI = pos[0];
    const posJ = pos[1];
    dibujarCasilleroDisponible(ctx, posI, posJ);
  }
}

function dibujarCasilleroOcupado(ctx, color, nickName, i, j) {
  const margin = casilleroSize / 2;

  ctx.fillStyle = color;
  ctx.strokeSyle = color;
  ctx.beginPath();
  ctx.arc(centerX + j * casilleroSize + margin,
    centerY + i * casilleroSize + margin,
    15, 0, 2 * Math.PI, false);

  ctx.stroke();
  ctx.fill();
  ctx.font = '18px Helvetica';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'black';
  const textMarginX = 20;
  const textMarginY = -20;
  const textX = centerX + j * casilleroSize + textMarginX;
  const textY = centerY + i * casilleroSize - textMarginY;
  const { width } = ctx.measureText(nickName);

  ctx.fillRect(textX, textY, width, 20);
  ctx.fillStyle = color;
  ctx.fillText(nickName, textX, textY);
}


const COCHERA = 'Cochera';
const VESTIBULO = 'Vestibulo';
const BODEGA = 'Bodega';
const ALCOBA = 'Alcoba';
const SALON = 'Salon';
const BIBLIOTECA = 'Biblioteca';
const PANTEON = 'Panteon';
const LABORATORIO = 'Laboratorio';

function dibujarRecintoCochera(ctx, availableRooms, mouse) {
  const img = new Image();
  img.src = spriteCochera;
  const posX =  centerX + 0 * casilleroSize;
  const posY = centerY + 0 * casilleroSize;
  ctx.drawImage(img, posX, posY, recintoSize, recintoSize);

  const iMouse = Math.floor((mouse.y) / casilleroSize);
  const jMouse = Math.floor((mouse.x) / casilleroSize);
  let mouseRangeX = 0 <= iMouse && iMouse <= 5;
  let mouseRangeY = 0 <= jMouse && jMouse <= 5;

  if (mouseRangeX && mouseRangeY){
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  }

  if (availableRooms?.includes(COCHERA)){
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 100, 0, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  
  }
}

function dibujarCasillero(ctx, sprite, i, j){
  const img = new Image();
  img.src = sprite;
  ctx.drawImage(img, centerX + j * casilleroSize, centerY + i * casilleroSize, 
    casilleroSize, casilleroSize);
}

function dibujarEntradas(ctx){
  dibujarCasillero(ctx, spriteEntradaIzqAzul, 2, 6);
  dibujarCasillero(ctx, spriteEntradaIzqAzul, 15, 6);
  dibujarCasillero(ctx, spriteEntradaIzqMarron,10, 6);

  dibujarCasillero(ctx, spriteEntradaDerAzul, 4, 13);
  dibujarCasillero(ctx, spriteEntradaDerMarron, 10, 13);
  dibujarCasillero(ctx, spriteEntradaDerAzul, 16, 13);
  
  dibujarCasillero(ctx, spriteEntradaAbajoMarron, 6, 4);
  dibujarCasillero(ctx, spriteEntradaArribaMarron, 6, 10);
  dibujarCasillero(ctx, spriteEntradaAbajoMarron, 6, 15);

  dibujarCasillero(ctx, spriteEntradaArribaMarron, 13, 3);
  dibujarCasillero(ctx, spriteEntradaAbajoMarron, 13, 10);
  dibujarCasillero(ctx, spriteEntradaArribaMarron, 13, 16);
}

function dibujarCasillerosEspeciales(ctx){
  dibujarCasillero(ctx, spriteMurcielago, 4, 6); 
  dibujarCasillero(ctx, spriteMurcielago, 14, 6);         

  dibujarCasillero(ctx, spriteSpider, 13, 4);   
  dibujarCasillero(ctx, spriteSpider, 13, 15);

  dibujarCasillero(ctx, spriteCobra, 6, 3); 
  dibujarCasillero(ctx, spriteCobra, 6, 14);

  dibujarCasillero(ctx, spriteEscorpion, 3, 13); 
  dibujarCasillero(ctx, spriteEscorpion, 14, 13);         
  
}

function dibujarCasillasTrampa(ctx) {
  dibujarCasillero(ctx, spriteTrampa, 6, 6);
  dibujarCasillero(ctx, spriteTrampa, 6, 13);
  dibujarCasillero(ctx, spriteTrampa, 13, 6);
  dibujarCasillero(ctx, spriteTrampa, 13, 13);
}

function dibujarRecintoVestibulo(ctx, availableRooms, mouse) {
  const img = new Image();
  img.src = spriteVestibulo;
  const posX = centerX + 0 * casilleroSize;
  const posY = centerY + 7 * casilleroSize;

  ctx.drawImage(img, posX, posY, recintoSize, recintoSize);

  const iMouse = Math.floor((mouse.y) / casilleroSize);
  const jMouse = Math.floor((mouse.x) / casilleroSize);
  let mouseRangeX = 7 <= iMouse && iMouse <= 12;
  let mouseRangeY = 0 <= jMouse && jMouse <= 5;

  if (mouseRangeX && mouseRangeY){
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  }

  if (availableRooms?.includes(VESTIBULO)){
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 100, 0, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  
  }


}

function dibujarRecintoBodega(ctx, availableRooms, mouse) {
  const img = new Image();
  img.src = spriteBodega;
  const posX = centerX + 0 * casilleroSize;
  const posY = centerY + 14 * casilleroSize;
  ctx.drawImage(img, posX, posY, recintoSize, recintoSize);
  
  const iMouse = Math.floor((mouse.y) / casilleroSize);
  const jMouse = Math.floor((mouse.x) / casilleroSize);
  let mouseRangeX = 14 <= iMouse && iMouse <= 19;
  let mouseRangeY = 0 <= jMouse && jMouse <= 5;

  if (mouseRangeX && mouseRangeY){
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  }

  if (availableRooms?.includes(BODEGA)){
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 100, 0, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  
  }

}

function dibujarRecintoAlcoba(ctx, availableRooms, mouse) {
  const img = new Image();
  img.src = spriteAlcoba;
  const posX = centerX + 7 * casilleroSize;
  const posY = centerY + 0 * casilleroSize
  ctx.drawImage(img, posX, posY, recintoSize, recintoSize);

  const iMouse = Math.floor((mouse.y) / casilleroSize);
  const jMouse = Math.floor((mouse.x) / casilleroSize);
  let mouseRangeX = 0 <= iMouse && iMouse <= 5;
  let mouseRangeY = 7 <= jMouse && jMouse <= 12;

  if (mouseRangeX && mouseRangeY){
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  }

  if (availableRooms?.includes(ALCOBA)){
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 100, 0, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  
  }

}

function dibujarRecintoMisterio(ctx, availableRooms, mouse) {
  const img = new Image();
  img.src = spriteMisterio;
  const posX = centerX + 7 * casilleroSize;
  const posY = centerY + 7 * casilleroSize;
  ctx.drawImage(img, posX, posY, recintoSize, recintoSize);
}

function dibujarRecintoSalon(ctx, availableRooms, mouse) {
  const img = new Image();
  img.src = spriteSalon;
  const posX = centerX + 7 * casilleroSize;
  const posY = centerY + 14 * casilleroSize;

  ctx.drawImage(img, posX, posY, recintoSize, recintoSize);
 
  const iMouse = Math.floor((mouse.y) / casilleroSize);
  const jMouse = Math.floor((mouse.x) / casilleroSize);
  let mouseRangeX = 14 <= iMouse && iMouse <= 19;
  let mouseRangeY = 7 <= jMouse && jMouse <= 12;

  if (mouseRangeX && mouseRangeY){
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  }

  if (availableRooms?.includes(SALON)){
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 100, 0, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  
  }

}

function dibujarRecintoBiblioteca(ctx, availableRooms, mouse) {
  const img = new Image();
  img.src = spriteBiblioteca;
  const posX = centerX + 14 * casilleroSize;
  const posY = centerY + 0 * casilleroSize;

  ctx.drawImage(img, posX, posY, recintoSize, recintoSize);

  const iMouse = Math.floor((mouse.y) / casilleroSize);
  const jMouse = Math.floor((mouse.x) / casilleroSize);
  let mouseRangeX = 0 <= iMouse && iMouse <= 5;
  let mouseRangeY = 14 <= jMouse && jMouse <= 19;

  if (mouseRangeX && mouseRangeY){
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  }

  if (availableRooms?.includes(BIBLIOTECA)){
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 100, 0, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  
  }

}

function dibujarRecintoPanteon(ctx, availableRooms, mouse) {
  const img = new Image();
  img.src = spritePanteon;
  const posX = centerX + 14 * casilleroSize;
  const posY = centerY + 7 * casilleroSize;
  ctx.drawImage(img, posX, posY, recintoSize, recintoSize);

  const iMouse = Math.floor((mouse.y) / casilleroSize);
  const jMouse = Math.floor((mouse.x) / casilleroSize);
  let mouseRangeX = 7 <= iMouse && iMouse <= 12;
  let mouseRangeY = 14 <= jMouse && jMouse <= 19;

  if (mouseRangeX && mouseRangeY){
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  }

  if (availableRooms?.includes(PANTEON)){
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 100, 0, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  
  }

}

function dibujarRecintoLaboratorio(ctx, availableRooms, mouse) {
  const img = new Image();
  img.src = spriteLaboratorio;
  const posX = centerX + 14 * casilleroSize;
  const posY = centerY + 14 * casilleroSize;
  ctx.drawImage(img, posX, posY, recintoSize, recintoSize);

  const iMouse = Math.floor((mouse.y) / casilleroSize);
  const jMouse = Math.floor((mouse.x) / casilleroSize);
  let mouseRangeX = 14 <= iMouse && iMouse <= 19;
  let mouseRangeY = 14 <= jMouse && jMouse <= 19;

  if (mouseRangeX && mouseRangeY){
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  }

  if (availableRooms?.includes(LABORATORIO)){
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 100, 0, 0.5)";
    ctx.rect(posX, posY, recintoSize, recintoSize);
    ctx.fill();
  
  }

}

function recintoToPos(recinto){
  switch (recinto){
    case COCHERA:
      return [2, 2];
      break;
    
    case VESTIBULO:
      return [9, 2];
      break;

    case BODEGA:
      return [15, 2];
      break;

    case ALCOBA:
      return [2, 9];
      break;

    case SALON:
      return [15, 9];
      break;

    case BIBLIOTECA:
      return [2, 16];
      break;

    case PANTEON:
      return [9, 16];
      break;

    case LABORATORIO:
      return [15, 16];
      break;

    default:
      return [0, 0];
  }
}


const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

function dibujarPosicionesJugadores(ctx, colores, players) {
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const { position } = player;
    const nickName = player.nickname;
    let posI = -1;
    let posJ = -1; 
    if(position !== null){
      posI = position[0];  
      posJ = position[1];
    }

    if (posI == -1 && posJ == -1 && player.room !== null){
      const [iRoom , jRoom] = recintoToPos(player.room);
      dibujarCasilleroOcupado(ctx, colores[i], nickName, iRoom, jRoom);
    } else if(posI !== -1 && posJ !== -1){
      dibujarCasilleroOcupado(ctx, colores[i], nickName, posI, posJ);
   }
  }
}

function dibujarRecintos(ctx, availableRooms, mouse){
    dibujarRecintoCochera(ctx, availableRooms, mouse);
    dibujarRecintoVestibulo(ctx, availableRooms, mouse);
    dibujarRecintoBodega(ctx, availableRooms, mouse);
    dibujarRecintoAlcoba(ctx, availableRooms, mouse);
    dibujarRecintoMisterio(ctx, availableRooms, mouse);
    dibujarRecintoSalon(ctx, availableRooms, mouse);
    dibujarRecintoBiblioteca(ctx, availableRooms, mouse);
    dibujarRecintoPanteon(ctx, availableRooms, mouse);
    dibujarRecintoLaboratorio(ctx, availableRooms, mouse);
}

function dibujarGrilla(ctx, mouse){
  for (let i = 0; i < cantidadCasilleros; i++) {
    for (let j = 0; j < cantidadCasilleros; j++) {
      
      if ([6, 13].includes(i) || [6, 13].includes(j)) {
        dibujarCasilleroVacio(ctx, i, j);
      }
    }
  }
  dibujarCasillerosEspeciales(ctx);
  dibujarCasillasTrampa(ctx)
  dibujarEntradas(ctx);
  const iMouse = Math.floor((mouse.y) / casilleroSize);
  const jMouse = Math.floor((mouse.x) / casilleroSize);
  
  if ([6, 13].includes(iMouse) || [6, 13].includes(jMouse)) {
        dibujarCasilleroClickeado(ctx, iMouse, jMouse);
        
  }

 
}

function mouseToRecinto(iMouse, jMouse){
  
  if (0 <= iMouse && iMouse <= 5){
    if (0 <= jMouse && jMouse <= 5){
      return COCHERA;
    }

    if(7 <= jMouse && jMouse<= 12){
      return ALCOBA; 
    }
    if (14 <= jMouse && jMouse <= 19){
      return BIBLIOTECA;
    }
  }
  
  if (7 <= iMouse && iMouse<= 12){
    if (0 <= jMouse && jMouse <= 5){
      return VESTIBULO;
    }
    if (14 <= jMouse && jMouse <= 19){
      return PANTEON;
    }
  }

  if(14 <= iMouse && iMouse <= 19 ){
    if (0 <= jMouse && jMouse<= 5){
      return BODEGA;
    }

    if (7 <= jMouse && jMouse <= 12){
      return SALON;
    }

    if (14 <= jMouse && jMouse <= 19){
      return LABORATORIO;
    }
  }
  return '';
}

function Tablero(props) {
  const {
    players, dado, idPlayer, idPartida,
    availablePositions, showAvailable,
    availableRooms
  } = props;
  
  const ref = useRef();
  const [pos, setPos] = useState([6, 0]);

  const mouse = useMouse(ref, {
    enterDelay: 100,
    leaveDelay: 100,
  });

  const [colores, setColores] = useState([
    'green', 'white', 'blue',
    'red', 'yellow', 'pink']);

  useEffect(() => {
    shuffleArray(colores);
  }, []);

  useEffect(async () => {
    const iMouse = Math.floor((mouse.y) / casilleroSize);
    const jMouse = Math.floor((mouse.x) / casilleroSize);
    console.log(mouseToRecinto(iMouse, jMouse));
    // quiere entrar a casillero.
    if (mouse.isDown && showAvailable) {
      if (availablePositions.some((arr) => arrayEquals(arr, [iMouse, jMouse])) && dado !== 0) {
        const [json, status] = await patchAPI(`${process.env.REACT_APP_URL_SERVER}/${idPartida}/move/${idPlayer}`,
          JSON.stringify({
            diceNumber: dado,
            position: [iMouse, jMouse],
            room: '',
          }));

        console.log(json, status);
        setPos([iMouse, jMouse]);
      }
    }

    // quiere entrar en recinto.
    if (availableRooms?.includes(mouseToRecinto(iMouse, jMouse)) && dado !== 0) {
      console.log('movemos a un recinto');
        const [json, status] = await patchAPI(`${process.env.REACT_APP_URL_SERVER}/${idPartida}/move/${idPlayer}`,
          JSON.stringify({
            diceNumber: dado,
            position: [-1, -1],
            room: mouseToRecinto(iMouse, jMouse),
          }));
          console.log('entrams a un recinto');
        console.log(json, status);
        setPos([iMouse, jMouse]);
    }

  }, [mouse.isDown, dado]);
  
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const ratio = getPixelRatio(ctx);
    const width = getComputedStyle(canvas)
      .getPropertyValue('width')
      .slice(0, -2);
    const height = getComputedStyle(canvas)
      .getPropertyValue('height')
      .slice(0, -2);

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    ctx.rect(centerX, centerY, widthTablero, heightTablero);
    ctx.fillStyle = 'black';
    ctx.fill();
    
    dibujarRecintos(ctx, availableRooms, mouse);

    dibujarGrilla(ctx, mouse);

    if (showAvailable) {
      dibujarCasillerosDisponibles(ctx, availablePositions);
    }

    if (players){ 
      dibujarPosicionesJugadores(ctx, colores, players);
    }

  });

  return (
    <div>
      <canvas
        ref={ref}
        style={{ width: widthTablero, height: heightTablero }}
      />
    </div>
  );
}

Tablero.propTypes = {
        players : PropTypes.object, 
        dado : PropTypes.number, 
        idPlayer : PropTypes.number, 
        idPartida : PropTypes.number,
        availablePositions : PropTypes.array, 
        showAvailable : PropTypes.bool,
        availableRooms : PropTypes.array
};

export default Tablero;