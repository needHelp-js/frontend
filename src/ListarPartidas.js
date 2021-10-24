import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';
import PropTypes from 'prop-types';

async function getAPI(url){
    try {
        const response = await fetch(url, {
            headers: {"Content-Type": "application/json"}
        });
        
        const json = await response.json();
        return json;

    } catch (error) {
        console.log(error);
    }

}

/*
async function postAPI(url, payload){
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {"Content-Type": "application/json" },
            body: payload
        });
    
        const text = await response.text();
        return text;

        }
     catch (error){
        console.log(error);
    }
}
*/

function TablaPartidas(props) {
    
    const [rows, setRows] = useState([]);
    
    const refresh = () => {
        async function fetchData(){
            const result = await getAPI(props.url);
            setRows(result);
        }
          
        fetchData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(refresh, []);
  
    console.log(rows);
    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
        <TableRow>
            <TableCell>Nombre de la partida</TableCell>
            <TableCell align="right">Jugadores dentro</TableCell>
            <TableCell align="right"> <Button
                variant="contained"  
                endIcon={<RefreshIcon />}
                onClick={refresh}
          > Actualizar </Button> </TableCell>
 
          </TableRow>
        </TableHead>
        <TableBody>
          {rows ? rows.map(row => (
            <TableRow 
              key={row.nombre}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.nombre ? row.nombre : 
                    console.log("falta atributo nombre")}
              </TableCell>
              <TableCell align="right">{row.jugadores ? row.jugadores : 
                    console.log("falta atributo jugadores")}
              </TableCell>
              <TableCell align="right"> <Button variant="outlined"> Unirse </Button> </TableCell>


            </TableRow>
          )) : <TableRow> <TableCell><ErrorIcon/> Sin conexión, actualice la lista. </TableCell></TableRow>}
        </TableBody>
        </Table>
        </TableContainer>
    );
}

TablaPartidas.propTypes = {
  url: PropTypes.string
};


function ListarPartidas(props){
    return(
        <div>
         <TablaPartidas url={props.url}/>
        </div>
    );
}

ListarPartidas.propTypes = {
    url: PropTypes.string
};

export default ListarPartidas;
