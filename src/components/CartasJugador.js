import Card from './Carta';
import styled from '@emotion/styled';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

function CartasJugador(props) {
    return (
        <Container>
            <Card cardName={props.monsterCard} />
            <Card cardName={props.victimCard} />
            <Card cardName={props.roomCard} />
        </Container>
    )
}

export default CartasJugador
