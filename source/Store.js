import { bindFunctions } from "./Utils";

export default class Store {
  constructor() {
    bindFunctions(this);

    this.listeners = new Set();
    this.state = {};
  }

  setState(state, callback) {
    this.state = Object.assign({}, this.state, state);

    for (let listener of this.listeners) {
      listener.forceUpdate();
    }

    callback();
  }

  _subscribe(owner) {
    this.listeners.add(owner);
  }

  _unsubscribe(owner) {
    this.listeners.delete(owner);
  }
}
