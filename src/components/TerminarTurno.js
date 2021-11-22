import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { fetchRequest, fetchHandlerError } from '../utils/fetchHandler';

let error_msg = ""

async function sendTerminarTurno(endpoint) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }

    return fetchRequest(endpoint, requestOptions)
}


function TerminarTurno(props) {
    const { endpoint } = props
    const [error_msg, setMsg] = useState(false);

    async function terminarTurno(endpoint) {
        sendTerminarTurno(endpoint).then((response) => {
            switch (response.type) {
                case fetchHandlerError.SUCCESS:
                    setMsg("")
                    break;
                case fetchHandlerError.REQUEST_ERROR:
                    setMsg("No es el turno del jugador");
                    break;
                case fetchHandlerError.INTERNAL_ERROR:
                    setMsg("Error Interno");
                    break;
            }
        })
    }

    return (
        <div>
            <Button
                onClick={() => terminarTurno(endpoint)}
                variant="contained"
                type="submit"
            >
                Terminar Turno
            </Button>
            <p>{error_msg}</p>
        </div>
    )

}

export default TerminarTurno;