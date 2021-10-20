import Textfield from '@mui/material/TextField';
import { Button} from '@mui/material';
import Stack from '@mui/material/Stack'
import './inputs.css'

function ElegirNickname() {

  const endpoint = 'http://127.0.0.1:5000/chooseNickname';
  
  return(
    <div className="inputBox">
      <form action={endpoint} method="POST">
        <Stack direction="row" alignItems="center" spacing={2}> 
          <Textfield id="nickname" name="nickname" label = "Nickname"/>
          <Button type="submit" variant="contained">Elegir</Button>
        </Stack>
      </form>
    </div>
  );
}

export default ElegirNickname;