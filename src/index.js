import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ListarPartidas from './components/ListarPartidas';
import Lobby from './components/Lobby';
import './index.css';

const URL = 'http://192.168.0.152:81';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <div>
    <Switch>
      <Route path='/partidas'>
        <ListarPartidas url={URL + '/partidas'}/>
      </Route>
      <Route path='/lobby' component ={Lobby}> 
      </Route>
    </Switch>
    </div>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
