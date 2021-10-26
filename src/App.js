import React from 'react';
import './App.css';
import ListarPartidas from './components/ListarPartidas.js'

const PARTIDAS_URL = 'http://192.168.0.152:81/partidas';
function App(){
  return(
    <div>
    <h1 style={{'text-align':'center'}}>Bienvenido a Misterio</h1> 
    <ListarPartidas url={PARTIDAS_URL}/>
    </div>
  );
}
 
export default App;
