import React from 'react';
import Textfield from '@mui/material/TextField';

function ElegirNickname(props) {
  const { nickname } = props;
  return (
    <Textfield
      id="nickname"
      name="nickname"
      label="Nickname"
      value={nickname}
      onChange={(event) => props.setNickName(event.target.value)}
    />
  );
}

export default ElegirNickname;
