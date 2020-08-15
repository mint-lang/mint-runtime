import { bindFunctions, setConstants } from "./Utils";

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

  _d(constants) {
    setConstants(this, constants);
  }

  _subscribe(owner) {
    this.listeners.add(owner);
  }

  _unsubscribe(owner) {
    this.listeners.delete(owner);
  }
}
