import Card from './Carta';
import {victimsNames, monstersNames, roomsNames} from '../utils/constants';

function MockCard(props) {
    return (
        <div style={{display: "flex", flexDirection: "row"}}>
            <Card cardName={victimsNames.CONDESA}></Card>
            <Card cardName={monstersNames.MOMIA}></Card>
            <Card cardName={roomsNames.COCHERA}></Card>
        </div>
    );
}

export default MockCard;