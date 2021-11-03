import React from 'react';

function Lobby(props) {
  const { idPartida, nombrePartida, idHost, nicknameHost } = props;
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
