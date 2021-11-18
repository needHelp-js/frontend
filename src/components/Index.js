import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ListarPartidas from './ListarPartidas';
import Lobby from './Lobby';
import Main from './Main';
import CrearPartida from './CrearPartida';
import Partida from './Partida';
import MockCard from './MockCard';
import {
  URL_HOME,
  URL_LISTAR_PARTIDAS,
  URL_CREAR_PARTIDA,
  URL_LOBBY,
  URL_PARTIDA,
} from '../routes';

const URL_SERVER = process.env.REACT_APP_URL_SERVER;

function Index(){
  return(
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
          <Route path={"/card-component"} component={MockCard} />
        </Switch>
      </div>
  );
}

export default Index;