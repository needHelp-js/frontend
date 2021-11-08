import React from 'react';
import { useEffect, useRef, useState } from 'react';
import useMouse from '@react-hook/mouse-position'
import spriteCochera from '../sprites/spriteCochera.png'; 
import spriteVestibulo from '../sprites/spriteVestibulo.png';
import spriteBodega from '../sprites/spriteBodega.png';
import spriteAlcoba from '../sprites/spriteAlcoba.png';
import spriteMisterio from '../sprites/spriteMisterio.png';
import spriteSalon from '../sprites/spriteSalon.png'; 
import spriteBiblioteca from '../sprites/spriteBiblioteca.png';
import spritePanteon from '../sprites/spritePanteon.png';
import spriteLaboratorio from '../sprites/spriteLaboratorio.png';;

const widthTablero = 1300;
const heightTablero = 1300; 
const centerY = 20;
const centerX = 20;
const cantidadCasilleros = 20;
const casilleroSize = widthTablero / cantidadCasilleros;

const getPixelRatio = context => {
  var backingStore =
  context.backingStorePixelRatio ||
  context.webkitBackingStorePixelRatio ||
  context.mozBackingStorePixelRatio ||
  context.msBackingStorePixelRatio ||
  context.oBackingStorePixelRatio ||
  context.backingStorePixelRatio ||
  1;
    
  return (window.devicePixelRatio || 1) / backingStore;
};

function dibujarCasilleroVacio(ctx, i, j){
  ctx.rect(centerX + j*casilleroSize, centerY + i*casilleroSize, 
                casilleroSize, casilleroSize);
  ctx.strokeStyle = 'white';
  ctx.stroke();
}


function dibujarCasilleroClickeado(ctx, i, j){
  ctx.fillStyle = 'white';
  ctx.fillRect(centerX + j*casilleroSize, centerY + i*casilleroSize, 
                casilleroSize, casilleroSize);

}

function dibujarCasilleroDisponible(ctx, i, j){
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(centerX + j*casilleroSize, centerY + i*casilleroSize, 
                casilleroSize, casilleroSize);
}

function dibujarCasilleroOcupado(ctx, color, nickName, i, j){
  const margin =  casilleroSize / 2;

  ctx.fillStyle = color;
  ctx.strokeSyle = color;
  ctx.beginPath();
  ctx.arc(centerX + j*casilleroSize + margin, 
    centerY + i*casilleroSize + margin, 
    15, 0, 2 * Math.PI, false); 
  
  ctx.stroke();
  ctx.fill();
  ctx.font = '30px Helvetica';
  ctx.textBaseline = 'top';  
  ctx.fillStyle = 'black';
  const textMarginX = 60;
  const textMarginY = -60;
  const textX = centerX + j*casilleroSize + textMarginX;
  const textY =  centerY + i*casilleroSize - textMarginY;
  const width = ctx.measureText(nickName).width;

  ctx.fillRect( textX, textY, width, 30);
  ctx.fillStyle = color; 
  ctx.fillText(nickName, textX, textY);

}

function dibujarRecintoCochera(ctx){
  const img = new Image();
  img.src = spriteCochera;
  ctx.drawImage(img, centerX + 0*casilleroSize, 
                centerY + 0*casilleroSize, 390, 390);

}

function dibujarRecintoVestibulo(ctx){
  const img = new Image();
  img.src = spriteVestibulo;
  ctx.drawImage(img, centerX + 0*casilleroSize, 
                centerY + 7*casilleroSize, 390, 390);

}


function dibujarRecintoBodega(ctx){
  const img = new Image();
  img.src = spriteBodega;
  ctx.drawImage(img, centerX + 0*casilleroSize, 
                centerY + 14*casilleroSize, 390, 390);

}


function dibujarRecintoAlcoba(ctx){
  const img = new Image();
  img.src = spriteAlcoba;
  ctx.drawImage(img, centerX + 7*casilleroSize, 
                centerY + 0*casilleroSize, 390, 390);

}

function dibujarRecintoMisterio(ctx){
  const img = new Image();
  img.src = spriteMisterio;
  ctx.drawImage(img, centerX + 7*casilleroSize, 
                centerY + 7*casilleroSize, 390, 390);

}

function dibujarRecintoSalon(ctx){
  const img = new Image();
  img.src = spriteSalon;
  ctx.drawImage(img, centerX + 7*casilleroSize, 
                centerY + 14*casilleroSize, 390, 390);

}

function dibujarRecintoBiblioteca(ctx){
  const img = new Image();
  img.src = spriteBiblioteca;
  ctx.drawImage(img, centerX + 14*casilleroSize, 
                centerY + 0*casilleroSize, 390, 390);

}

function dibujarRecintoPanteon(ctx){
  const img = new Image();
  img.src = spritePanteon;
  ctx.drawImage(img, centerX + 14*casilleroSize,
                centerY + 7*casilleroSize, 390, 390);

}

function dibujarRecintoLaboratorio(ctx){
  const img = new Image();
  img.src = spriteLaboratorio;
  ctx.drawImage(img, centerX + 14*casilleroSize, 
                centerY + 14*casilleroSize, 390, 390);

}

function Tablero(props) {
  let ref = useRef();
  const [pos, setPos] = useState([6,0]);

  const mouse = useMouse(ref, {
    enterDelay: 100,
    leaveDelay: 100,
  })

  useEffect(() => {
    let canvas = ref.current;
    let ctx = canvas.getContext('2d');
    let ratio = getPixelRatio(ctx);
    let width = getComputedStyle(canvas)
          .getPropertyValue('width')
          .slice(0, -2);
    let height = getComputedStyle(canvas)
          .getPropertyValue('height')
          .slice(0, -2);

    canvas.width = width * ratio;
    canvas.height = height * ratio;
        
    ctx.rect(centerX, centerY, widthTablero, heightTablero);
    ctx.fillStyle = 'black';
    ctx.fill();
     
    dibujarRecintoCochera(ctx);
    dibujarRecintoVestibulo(ctx);
    dibujarRecintoBodega(ctx);

    dibujarRecintoAlcoba(ctx);
    dibujarRecintoMisterio(ctx);
    dibujarRecintoSalon(ctx);
    
    dibujarRecintoBiblioteca(ctx);
    dibujarRecintoPanteon(ctx);
    dibujarRecintoLaboratorio(ctx);

    for (let i = 0; i < cantidadCasilleros; i++){
      for (let j = 0; j < cantidadCasilleros; j++){
        if ( [6, 13].includes(i) || [6, 13].includes(j)){
          dibujarCasilleroVacio(ctx, i, j);
          
          let iMouse = Math.floor((2*mouse.y)/casilleroSize);
          let jMouse = Math.floor((2*mouse.x)/casilleroSize);
          if (mouse.isDown && iMouse < 20 && jMouse < 20){
            if ([6,13].includes(iMouse) || [6, 13].includes(jMouse)){
              setPos([ iMouse, jMouse]);
            }
          }
          if (iMouse == i && jMouse == j){
            dibujarCasilleroClickeado(ctx, i, j);
          }
          dibujarCasilleroOcupado(ctx, 'white', 'Yo', pos[0], pos[1]);
        } 
      }
    }
    
    dibujarCasilleroOcupado(ctx, 'green', 'GEROGE', 6, 0);
    dibujarCasilleroOcupado(ctx, 'red', 'RINGO', 9, 6);
    dibujarCasilleroOcupado(ctx, 'pink', 'PAUL', 9, 13);
    dibujarCasilleroOcupado(ctx, 'blue', 'JOHN', 13, 2);
    

  });

  return (
    <div>
    <canvas
      ref={ref}
      style={{width: widthTablero, height: heightTablero}}   

     />
    </div>
  );
}

export default Tablero;
