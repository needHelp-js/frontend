import * as React from 'react';
import { ListItem, ListItemText } from '@mui/material';
import style from './MostrarJugadores.module.css'


function ordenarJugadores(rows) {
  const myData = rows
    .sort((a,b) => a.turnOrder > b.turnOrder ? 1 : -1)
    .map((player) => (
      
        <ListItem key={player.myData}>
          <ListItemText primary={player.turnOrder} />
          <ListItemText primary={player.nickname} />
        </ListItem>
      
    ));
  return myData;
}

function MostrarJugadores(props) {
  const {
    playerList,
  } = props;

  return (
    playerList.length > 0 && (
    <div>
		<table className={style.table}>
    <thead>
						<tr className={style.row}>
							<th className={style['row-data']}>Jugadores</th>
						</tr>
		</thead>
        <tbody>
            {ordenarJugadores(playerList)}
        </tbody>
      </table>
	</div>
      
    )
  );


   

}     

export default MostrarJugadores;

