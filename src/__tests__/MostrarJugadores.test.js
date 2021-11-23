import * as React from 'react';
import { render, screen } from '@testing-library/react';
import MostrarJugadores from '../components/MostrarJugadores';

const idPlayer = 1;
const idPlayer2 = 2;
const idPlayer3 = 3;
const idPlayer4 = 4;

const nicknamePlayer = 'nicknameDelJugador';
const nicknamePlayer2 = 'nicknameDelJugador_2';
const nicknamePlayer3 = 'nicknameDelJugador_3';
const nicknamePlayer4 = 'nicknameDelJugador_4';

const turnOrderPlayer = 2;
const turnOrderPlayer2 = 4;
const turnOrderPlayer3 = 3;
const turnOrderPlayer4 = 1;

const players = [{ id: idPlayer, nickname: nicknamePlayer, turnOrder: turnOrderPlayer }];

const players2 = [{ id: idPlayer, nickname: nicknamePlayer, turnOrder: turnOrderPlayer },
  { id: idPlayer2, nickname: nicknamePlayer2, turnOrder: turnOrderPlayer2 },
];

const players4 = [{ id: idPlayer, nickname: nicknamePlayer, turnOrder: turnOrderPlayer },
  { id: idPlayer2, nickname: nicknamePlayer2, turnOrder: turnOrderPlayer2 },
  { id: idPlayer3, nickname: nicknamePlayer3, turnOrder: turnOrderPlayer3 },
  { id: idPlayer4, nickname: nicknamePlayer4, turnOrder: turnOrderPlayer4 },
];

describe('MostrarJugadores', () => {
  it('Renderiza el componente', async () => {
    render(
      <MostrarJugadores playerList={players} />,
    );

    expect(await screen.findByText(turnOrderPlayer)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer)).toBeInTheDocument();
  });

  it('Muestra lista con 2 jugadores', async () => {
    render(
      <MostrarJugadores playerList={players2} />,
    );

    expect(await screen.findByText(turnOrderPlayer)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer)).toBeInTheDocument();
    expect(await screen.findByText(turnOrderPlayer2)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer2)).toBeInTheDocument();
  });

  it('Muestra lista con 4 jugadores', async () => {
    render(
      <MostrarJugadores playerList={players4} />,
    );

    expect(await screen.findByText(turnOrderPlayer)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer)).toBeInTheDocument();
    expect(await screen.findByText(turnOrderPlayer2)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer2)).toBeInTheDocument();
    expect(await screen.findByText(turnOrderPlayer3)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer3)).toBeInTheDocument();
    expect(await screen.findByText(turnOrderPlayer4)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer4)).toBeInTheDocument();
  });
});
