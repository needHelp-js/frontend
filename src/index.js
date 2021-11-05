import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import ListarPartidas from './components/ListarPartidas';
import Lobby from './components/Lobby';
import Main from './components/Main';
import CrearPartida from './components/CrearPartida';
import Partida from './components/Partida';
import './index.css';
import {
  URL_HOME,
  URL_LISTAR_PARTIDAS,
  URL_CREAR_PARTIDA,
  URL_LOBBY,
  URL_PARTIDA,
} from './routes';

require('dotenv').config();

const URL_SERVER = process.env.REACT_APP_URL_SERVER;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path={URL_HOME} component={Main} />
          <Route path={URL_LISTAR_PARTIDAS}>
            <ListarPartidas url={URL_SERVER} />
          </Route>
          <Route path={URL_CREAR_PARTIDA}>
            <CrearPartida endpoint={URL_SERVER} />
          </Route>
          <Route path={URL_LOBBY} component={Lobby} />
          <Route path={URL_PARTIDA} component={Partida} />
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
