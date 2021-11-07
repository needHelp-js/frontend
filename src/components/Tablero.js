import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
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
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(centerX + j*casilleroSize, centerY + i*casilleroSize, 
                casilleroSize, casilleroSize);

}

function dibujarCasilleroOcupado(ctx, color, nickName, i, j){
    ctx.fillStyle = color;
    ctx.fillRect(centerX + j*casilleroSize, centerY + i*casilleroSize, 
                casilleroSize, casilleroSize);
    
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillStyle = color;

    let marginX = 52;
    let marginY = 10;
    ctx.fillText(nickName,
      centerX + j*casilleroSize + marginX, 
      centerY + i*casilleroSize - marginY);

}

function Tablero(props) {
  let ref = useRef();
  
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
      for(let j = 0; j < cantidadCasilleros; j++){
        if( [6, 13].includes(i) || [6, 13].includes(j)){
          dibujarCasilleroVacio(ctx, i, j);
          
          let iMouse = Math.floor((2*mouse.y)/casilleroSize);
          let jMouse = Math.floor((2*mouse.x)/casilleroSize);
          if (mouse.isDown){
            console.log("click!");
          }
          if (iMouse == i && jMouse == j){
            dibujarCasilleroClickeado(ctx, i, j);
          }
        } 
      }
    }

    dibujarCasilleroOcupado(ctx, "green", "George", 6, 2);
    dibujarCasilleroOcupado(ctx, "red", "Ringo", 9, 6);
    dibujarCasilleroOcupado(ctx, "pink", "Paul", 9, 13);
    dibujarCasilleroOcupado(ctx, "blue", "John", 13, 2);
    dibujarCasilleroOcupado(ctx, "black", "Yo", 13, 7);

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
