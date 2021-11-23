import * as React from 'react';
import { TableCell, TableHead, TableRow, TableBody, Table } from '@mui/material';
import PropTypes from 'prop-types';

function ordenarJugadores(rows) {
  console.log('ordenamos jugadores');
  const myData = rows
    .sort((a,b) => a.turnOrder > b.turnOrder ? 1 : -1)
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
    <div>
      <Table
          style={{maxWidth:'10%', margin: '0 auto'}}>
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

MostrarJugadores.propTypes = { playerList: PropTypes.array };

export default MostrarJugadores;

