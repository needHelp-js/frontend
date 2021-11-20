import Card from './Carta';
import styled from '@emotion/styled';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

function CartasJugador(props) {
    const {cards} = props;

    const cardElems = cards.map((elem, idx) => (
      <Card key={idx} cardName={elem} />
    ));

    return (
        <Container>
            {cardElems}
        </Container>
    )
}

export default CartasJugador
