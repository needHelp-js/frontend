import React from 'react';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import { render, unmountComponentAtNode } from 'react-dom';
import { setupServer } from 'msw/node';
import { accusationState, monstersNames, roomsNames, victimsNames } from '../utils/constants';
import Acusar from '../components/Acusar';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';

const idPartida = "1";
const idPlayer = "1";
const urlServer = `${process.env.REACT_APP_URL_SERVER}/${idPartida}/accuse/${idPlayer}`;
const server = setupServer(
  rest.post(urlServer, (req, res, ctx) => {
    localStorage.setItem('postRecibido',true);
    return res(
      ctx.status(204),
    );
  }),
);

let container = null;
beforeAll(() => server.listen());
beforeEach(() => {
  server.resetHandlers();
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

afterAll(() => server.close());

describe("Componente Acusar", () => {
  it("renderiza componente", async () => {
    let stage = accusationState.NOT_ACCUSING;
    let error = false;
    let setAccusationStage = (state) => {
      stage = state;
    };
    let setHasError = (error) => {
      hasError = error;
    };
    let setErrorMessage = (msg) => {
      errorMessage = msg;
    };

    await act(async () => {
      render(
        <Acusar
          setAccusationStage={setAccusationStage}
          setHasError={setHasError}
          setErrorMessage={setErrorMessage}
          idPartida={idPartida}
          idPlayer={idPlayer}
        />,
        container
      );
    });

    expect(await screen.findByText("Acusar")).toBeInTheDocument();
  });

  it('Realiza la acusacion correctamente', async () => {
    let stage = accusationState.NOT_ACCUSING;
    let error = false;
    let setAccusationStage = (state) => {
      stage = state;
    };
    let setHasError = (error) => {
      hasError = error;
    };
    let setErrorMessage = (msg) => {
      errorMessage = msg;
    };

    await act(async () => {
      render(
        <Acusar
          setAccusationStage={setAccusationStage}
          setHasError={setHasError}
          setErrorMessage={setErrorMessage}
          idPartida={idPartida}
          idPlayer={idPlayer}
        />,
        container
      );
    });

    await act(async () => {
      userEvent.click(await screen.findByRole('button', { name: /Acusar/ }));
      userEvent.click(screen.getByRole('img', { name: victimsNames.AMA_DE_LLAVES }));
      userEvent.click(screen.getByRole('img', { name: monstersNames.DRACULA }));
      userEvent.click(screen.getByRole('img', { name: roomsNames.ALCOBA }));
      userEvent.click(await screen.findByRole('button', { name: /Acusar/ }));
    });

    const recibido = localStorage.getItem("postRecibido")
    expect(recibido).toBe("true");
  });
});