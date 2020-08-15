import { bindFunctions, setConstants } from "./Utils";
import { compareObjects } from "./Compare";

export default class Provider {
  constructor() {
    bindFunctions(this);

    this.subscriptions = new Map();
    this.state = {};
  }

  setState(state, callback) {
    this.state = Object.assign({}, this.state, state);
    callback();
  }

  _d(constants) {
    setConstants(this, constants);
  }

  _subscribe(owner, object) {
    const current = this.subscriptions.get(owner);

    /* Objects will always be records. */
    if (
      object === null ||
      object === undefined ||
      (current !== undefined &&
        current !== null &&
        compareObjects(current, object))
    ) {
      return;
    }

    this.subscriptions.set(owner, object);
    this._update();
  }

  _unsubscribe(owner) {
    if (!this.subscriptions.has(owner)) {
      return;
    }

    this.subscriptions.delete(owner);
    this._update();
  }

  _update() {
    this.update();
  }

  get _subscriptions() {
    return Array.from(this.subscriptions.values());
  }

  update() {}
}
