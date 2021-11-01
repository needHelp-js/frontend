import React from 'react';
import { Link } from "react-router-dom";

function Lobby(props) {
  const { idPartida, nombrePartida, idHost, nicknameHost } = props.location.state;
  return (
    <div>
      <p>
        Este es el Lobby: {nombrePartida} ID: {idPartida}
      </p>
      <p>
        Usted es el Host: {nicknameHost} ID: {idHost}
      </p>
    </div>

  );
}

export default Lobby;
