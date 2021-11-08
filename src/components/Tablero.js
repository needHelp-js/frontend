import React from 'react';
import { useEffect, useRef, useState } from 'react';
import useMouse from '@react-hook/mouse-position'

const widthTablero = 1000;
const heightTablero = 1000; 
const centerY = 20;
const centerX = 20;
const casilleroSize = 50;
const cantidadCasilleros = 20;

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
  ctx.stroke();
}

function dibujarCasilleroClickeado(ctx, i, j){
  ctx.fillStyle = 'black';
  ctx.fillRect(centerX + j*casilleroSize, centerY + i*casilleroSize, 
                casilleroSize, casilleroSize);

}

function dibujarCasilleroDisponible(ctx, i, j){
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(centerX + j*casilleroSize, centerY + i*casilleroSize, 
                casilleroSize, casilleroSize);

}

function dibujarCasilleroOcupado(ctx, color, nickName, i, j){
  const marginX = 25;
  const marginY = 25;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX + j*casilleroSize + marginX, 
    centerY + i*casilleroSize + marginY, 
    15, 0, 2 * Math.PI, false); 
  
  ctx.fill(); 
  ctx.font = "30px Arial";
  ctx.fillStyle = color;

    
  
  const textMarginX = 55;
  const textMarginY = 10;
    
  ctx.fillText(nickName,
      centerX + j*casilleroSize + textMarginX, 
      centerY + i*casilleroSize - textMarginY);

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
    ctx.stroke();

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
          dibujarCasilleroOcupado(ctx, "black", "Yo", pos[0], pos[1]);
        } 
      }
    }

    dibujarCasilleroOcupado(ctx, "green", "George", 6, 0);
    dibujarCasilleroOcupado(ctx, "red", "Ringo", 9, 6);
    dibujarCasilleroOcupado(ctx, "pink", "Paul", 9, 13);
    dibujarCasilleroOcupado(ctx, "blue", "John", 13, 2);

    ctx.font = "30px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText("Misterio", centerX+450, centerY+500);
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

export default Tablero;
