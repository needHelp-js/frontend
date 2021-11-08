import React from 'react';
import { useEffect, useRef, useState } from 'react';
import useMouse from '@react-hook/mouse-position'

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
  ctx.strokeStyle = "white";
  ctx.stroke();
}

function dibujarCasilleroEntrada(ctx, dir, textAlign, i, j){
  const margin = casilleroSize / 2;
  ctx.textAlign = textAlign;

  ctx.fillStyle = 'white'; 
  ctx.fillText(dir,
      centerX + j*casilleroSize + margin, 
      centerY + i*casilleroSize + margin); 
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
  ctx.font = "30px Arial";
  ctx.fillStyle = color;
  const textMarginX = 80;
  const textMarginY = -100;
    
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
    ctx.fillStyle = "black";
    ctx.fill();
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
          dibujarCasilleroOcupado(ctx, "green", "Yo", pos[0], pos[1]);
        } 
      }
    }
    dibujarCasilleroEntrada(ctx, "◄", "end", 2, 6);
    dibujarCasilleroEntrada(ctx, "◄", "end", 15, 6);
    dibujarCasilleroEntrada(ctx, "◄", "end", 10, 6);
    dibujarCasilleroEntrada(ctx, "►", "left", 4, 13);
    dibujarCasilleroEntrada(ctx, "►", "left", 10, 13);
    dibujarCasilleroEntrada(ctx, "►", "left", 16, 13);
    dibujarCasilleroEntrada(ctx, "▲", "center", 13, 3);
    dibujarCasilleroEntrada(ctx, "▼", "center", 13, 10);
    dibujarCasilleroEntrada(ctx, "▲ ", "center", 13, 16);
    dibujarCasilleroEntrada(ctx, "▼", "center", 6, 4);
    dibujarCasilleroEntrada(ctx, "▲", "center", 6, 10);
    dibujarCasilleroEntrada(ctx, "▼", "center", 6, 15);
    
    
    dibujarCasilleroOcupado(ctx, "green", "George", 6, 0);
    //dibujarCasilleroOcupado(ctx, "red", "Ringo", 9, 6);
    dibujarCasilleroOcupado(ctx, "pink", "Paul", 9, 13);
    //dibujarCasilleroOcupado(ctx, "blue", "John", 13, 2);
    

    ctx.font = "30px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("Misterio", centerX + 600, centerY + 650);
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
