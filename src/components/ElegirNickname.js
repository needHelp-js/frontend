import React from 'react';
import Textfield from '@mui/material/TextField';

function ElegirNickname(props) {
  return (
    <Textfield
      id="nickname"
      name="nickname"
      label="Nickname"
      onChange={(event) => props.setNickName(event.target.value)}
    />
  );
}

export default ElegirNickname;
