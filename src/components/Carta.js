import React from 'react';
import { getCardSource } from '../utils/utils';

function Card(props) {
  const {
    cardName, id, width, height, onClick,
  } = props;

  const cardSrc = getCardSource(cardName);

  const size = {
    width: width || 150,
    height: height || 300,
  };

  if (onClick !== null) {
    return (
      <div>
        <img
          id={id}
          src={cardSrc}
          alt={cardName}
          width={size.width}
          height={size.height}
          onClick={() => onClick()}
        />
      </div>
    );
  }

  return (
    <div>
      <img
        id={id}
        src={cardSrc}
        alt={cardName}
        width={size.width}
        height={size.height}
      />
    </div>
  );
}

export default Card;