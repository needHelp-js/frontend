class SingletonAlreadyInitialized extends Error {
}

class SocketSingleton {

  static #socket = null;

  static init(socket) {

      if (this.#socket !== null) {
        throw new SingletonAlreadyInitialized("Singleton already has an instance");
      }

      this.#socket = socket;
  }

  static getInstance() {
    return this.#socket;
  }
}


export default SocketSingleton;