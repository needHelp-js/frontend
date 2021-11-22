import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { fetchRequest, fetchHandlerError } from '../utils/fetchHandler';

async function sendTerminarTurno(endpoint) {
  const requestOptions = {
    method: 'POST',
  };

  return fetchRequest(endpoint, requestOptions);
}

function TerminarTurno(props) {
  const { endpoint } = props;
  const { disabled } = props;
  const [errorMsg, setMsg] = useState('');
  const [terminando, setTerminando] = useState(false);

  useEffect(() => {
    let isMounted = false;

    async function terminarTurno() {
      sendTerminarTurno(endpoint).then((response) => {
        switch (response.type) {
          case fetchHandlerError.SUCCESS:
            if (isMounted) {
              setMsg('');
            }
            break;
          case fetchHandlerError.REQUEST_ERROR:
            setMsg(response.payload);
            isMounted = false;
            break;
          case fetchHandlerError.INTERNAL_ERROR:
            setMsg(response.payload);
            isMounted = false;
            break;
          default:
            break;
        }
      });
    }

    if (terminando) {
      terminarTurno();
    }

    return () => { isMounted = false; };
  }, [terminando, endpoint]);

  return (
    <div>
      <Button
        onClick={() => setTerminando(true)}
        variant="contained"
        type="submit"
        disabled = {disabled}
      >
        Terminar Turno
      </Button>
      <p>{errorMsg}</p>
    </div>
  );
}

export default TerminarTurno;
