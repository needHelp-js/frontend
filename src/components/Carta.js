import React from 'react';
import { getCardSource } from '../utils/utils';

function Card(props) {
  const { cardName, width, height } = props;

  const cardSrc = getCardSource(cardName);

  const size = {
    width: width || '150',
    height: height || '300',
  };

  return (
    <div>
      <img
        src={cardSrc}
        alt={cardName}
        width={size.width}
        height={size.height}
      />
    </div>
  );
}

export default Card;
