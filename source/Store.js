export default class Store {
  constructor() {
    this.listeners = new Set();
    this.props = {};
  }

  setState(props, callback) {
    this.props = Object.assign({}, this.state, props);

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
