import { getCardSource } from '../utils/utils';

function Card(props) {
  const cardSrc = getCardSource(props.cardName);

  var size = {
    width: props.width ? props.width : '150',
    height: props.height ? props.height : '300',
  };

  return (
    <div>
      <img src={cardSrc} alt={props.cardName} {...size} />
    </div>
  );
}

export default Card;
