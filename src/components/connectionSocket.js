class SingletonAlreadyInitialized extends Error {
}

class SocketSingleton {

  #socket

  constructor() {
    this.#socket = null;
  }

  init(socket) {

      if (this.#socket !== null) {
        throw new SingletonAlreadyInitialized("Singleton already has an instance");
      }

      this.#socket = socket;
  }

  getInstance() {
    return this.#socket;
  }
}

const connectionSocket = new SocketSingleton();

export default connectionSocket;