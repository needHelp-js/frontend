import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import { ListItem, ListItemText } from '@mui/material';

const data = [
  { name: 'matiata' },
  { name: 'pepito' },
  { name: 'elPantera' },
];

function mostrarJugadores(rows) {
  console.log('en la func rows es', rows);
  let res = [];
  if (rows.length > 0) {
    res = rows.map((row) => (
      <ListItem>
        <ListItemText primary={row.name} />
      </ListItem>
    ));
  }
  return res;
}

function ListarJugadores() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(data);
  }, []);

  console.log('data es', data);

  return (
    <List>
      {mostrarJugadores(rows)}
    </List>
  );
}

export default ListarJugadores;
