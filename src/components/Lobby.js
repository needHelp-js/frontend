import React from 'react';
import { Link } from "react-router-dom";

function Lobby(props) {
  const { idPartida, nombrePartida, idGuest, guestName } = props.location.state;
  return (
    <div>
      <p>
        Este es el Lobby: {nombrePartida} ID: {idPartida}
      </p>
      <p>
        Usted es el Invitado: {guestName} ID: {idGuest}
      </p>
    </div>

  );
}

export default Lobby;
