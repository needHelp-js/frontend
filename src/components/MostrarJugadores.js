import * as React from 'react';
import {
  TableCell, TableHead, TableRow, TableBody, Table,
} from '@mui/material';

function ordenarJugadores(rows) {
  console.log('ordenamos jugadores');
  const myData = rows
    .sort((a, b) => (a.turnOrder > b.turnOrder ? 1 : -1))
    .map((player) => (

      <TableRow key={player.id}>
        <TableCell>{player.turnOrder}</TableCell>
        <TableCell>{player.nickname}</TableCell>
      </TableRow>

    ));

  return myData;
}

function MostrarJugadores(props) {
  const {
    playerList,
  } = props;

  return (
    <div style={{ maxWidth: '10%', margin: '0 auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Turno</TableCell>
            <TableCell>Jugadores</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ordenarJugadores(playerList)}
        </TableBody>
      </Table>
    </div>

  );
}

export default MostrarJugadores;
