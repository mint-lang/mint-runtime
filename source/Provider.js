export default class Provider {
  constructor() {
    this.subscriptions = new Map();
  }

  _subscribe(owner, object) {
    if (this.subscriptions.has(owner)) {
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
    if (this.subscriptions.size == 0) {
      this.detach();
    } else {
      this.attach();
    }
  }

  get _subscriptions() {
    let array = [];
    for (let item of this.subscriptions.values()) {
      array.push(item);
    }
    return array;
  }

  attach() {}

  detach() {}
}
