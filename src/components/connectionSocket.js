import SingletonAlreadyInitialized from './errorSocket';

class SocketSingleton {
  static #socket = null;

  static init(socket) {
    if (this.#socket !== null) {
      throw new SingletonAlreadyInitialized('Singleton already has an instance');
    }

    this.#socket = socket;
  }

  static getInstance() {
    return this.#socket;
  }

  static destroy() {
    if (this.#socket !== null) {
      this.#socket.close();
      this.#socket = null;
    }
  }
}

export default SocketSingleton;
