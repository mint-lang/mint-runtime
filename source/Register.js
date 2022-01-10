import { h, render } from "preact";

class Component extends HTMLElement {
  constructor() {
    super();
    this.props = {};

    for (const { original, name } of this.constructor.props) {
      Object.defineProperty(this, original, {
        get() {
          return this.props[name];
        },
        set(value) {
          this.props[name] = value;
          this._render();
        },
      });
    }
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    for (const { original, name } of this.constructor.props) {
      if (original !== attribute) continue;
      this.props[name] = newValue;
      this._render();
    }
  }

  disconnectedCallback() {
    render(null, this);
  }

  _render() {
    if (this.isConnected) {
      render(h(this.constructor.component, this.props), this);
    }
  }
}

export default function register(component, tag, props) {
  const componentClass = class extends Component {};

  componentClass.observedAttributes = props.map((item) => item.original);
  componentClass.component = component;
  componentClass.props = props;

  customElements.define(tag, componentClass);
}
