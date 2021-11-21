import React from 'react';
import styled from '@emotion/styled';
import Card from './Carta';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

function CartasJugador(props) {
  const { cards } = props;

  const cardElems = cards.map((elem) => (
    <Card key={elem} cardName={elem} />
  ));

  return (
    <Container>
      {cardElems}
    </Container>
  );
}

export default CartasJugador;
