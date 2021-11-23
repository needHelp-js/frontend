import * as React from 'react';
import { render, screen } from '@testing-library/react';
import MostrarJugadores from '../components/MostrarJugadores';


let idPlayer = 1;
let idPlayer_2 = 2;
let idPlayer_3 = 3;
let idPlayer_4 = 4;

const nicknamePlayer = 'nicknameDelJugador';
const nicknamePlayer_2 = 'nicknameDelJugador_2';
const nicknamePlayer_3 = 'nicknameDelJugador_3';
const nicknamePlayer_4 = 'nicknameDelJugador_4';

let turnOrderPlayer = 2;
let turnOrderPlayer_2 = 4;
let turnOrderPlayer_3 = 3;
let turnOrderPlayer_4 = 1;


const players = [{ id: idPlayer, nickname: nicknamePlayer, turnOrder: turnOrderPlayer }];

const players_2 = [ { id: idPlayer, nickname: nicknamePlayer, turnOrder: turnOrderPlayer },
                    { id: idPlayer_2, nickname: nicknamePlayer_2, turnOrder: turnOrderPlayer_2 },
                  ];

const players_4 = [{ id: idPlayer, nickname: nicknamePlayer, turnOrder: turnOrderPlayer },
                   { id: idPlayer_2, nickname: nicknamePlayer_2, turnOrder: turnOrderPlayer_2 },
                   { id: idPlayer_3, nickname: nicknamePlayer_3, turnOrder: turnOrderPlayer_3 },
                   { id: idPlayer_4, nickname: nicknamePlayer_4, turnOrder: turnOrderPlayer_4 },
                  ];


describe('MostrarJugadores', () => {
  it('Renderiza el componente', async () => {
    render(
        <MostrarJugadores playerList={players}/>,
    );


    expect(await screen.findByText(turnOrderPlayer)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer)).toBeInTheDocument();
    

  });

  it('Muestra lista con 2 jugadores', async () => {
    render(
        <MostrarJugadores playerList={players_2} />,
    );

    expect(await screen.findByText(turnOrderPlayer)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer)).toBeInTheDocument();
    expect(await screen.findByText(turnOrderPlayer_2)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer_2)).toBeInTheDocument();
  });

  it('Muestra lista con 4 jugadores', async () => {
    render(
        <MostrarJugadores playerList={players_4}/>,
    );


    expect(await screen.findByText(turnOrderPlayer)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer)).toBeInTheDocument();
    expect(await screen.findByText(turnOrderPlayer_2)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer_2)).toBeInTheDocument();
    expect(await screen.findByText(turnOrderPlayer_3)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer_3)).toBeInTheDocument();
    expect(await screen.findByText(turnOrderPlayer_4)).toBeInTheDocument();
    expect(await screen.findByText(nicknamePlayer_4)).toBeInTheDocument();
  });
 
});