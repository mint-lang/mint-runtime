export default class Store {
  constructor() {
    this.listeners = new Set();
    this.props = {};
  }

  setState(props, callback) {
    let prev = this.state;
    this.props = Object.assign({}, this.state, props);

    Mint.diff(this.__displayName, prev, this.state);

    for (let listener of this.listeners) {
      listener.forceUpdate();
    }

    Mint.forceUpdate();
    callback();
  }

  _subscribe(owner) {
    this.listeners.add(owner);
  }

  _unsubscribe(owner) {
    this.listeners.delete(owner);
  }
}
