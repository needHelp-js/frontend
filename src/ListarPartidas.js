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

function mostrarFilas(rows) {
    if (rows){
        if (rows.length > 0){
            return(
                rows.map(row => (
                <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0}}}
                >
                <TableCell component="th" scope="row">
                    {row.name ? row.name :
                        console.log("falta atributo nombre")}
                </TableCell>
                <TableCell align="right">
                    {row.playerCount ? row.playerCount :
                        console.log("falta atributo jugadores")}
                </TableCell>
                <TableCell align="right"> 
                <Button variant="outlined"> 
                    Unirse 
                </Button> 
                </TableCell>
                </TableRow>
                ))
            );
          } 
         else {
            return(
                <TableRow>
                <TableCell>
                    No hay partidas.
                </TableCell>
                </TableRow>
            );
          }
      }

    return(
        <TableRow> 
        <TableCell> 
        <ErrorIcon/> 
            Sin conexión, actualice la lista.             
        </TableCell>
        </TableRow>
    );
    
}

function TablaPartidas(props) {
    
    const [rows, setRows] = useState([]);
    const [refresh, setRefresh] = useState(false); 
    
    useEffect(async () => {
        if (refresh) {
            const data = await getAPI(props.url);
            setRows(data);
            setRefresh(false);
        }});

    return (
        <TableContainer component={Paper}>
        <Table 
            sx={{ minWidth: 650 }}
            aria-label="simple table"
        >
        <TableHead>
        <TableRow>
        <TableCell>
            Nombre de la partida
        </TableCell>
        <TableCell align="right">
            Jugadores dentro
        </TableCell>
        <TableCell align="right"> 
        <Button
            variant="contained"  
            endIcon={<RefreshIcon />}
            onClick={() => setRefresh(true)}
        >
            Actualizar 
        </Button> 
        </TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {mostrarFilas(rows)} 
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
