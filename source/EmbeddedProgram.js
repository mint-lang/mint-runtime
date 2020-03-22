import { Component, h, render } from "preact";

class Root extends Component {
  render() {
    const components = [];

    for (let key in this.props.globals) {
      components.push(
        h(this.props.globals[key], {
          ref: item => item._persist(),
          key: key
        })
      );
    }

    return h("div", {}, [...components, ...this.props.children]);
  }
}

Root.displayName = "Mint.Root";

export default class Program {
  constructor(base) {
    if (base && base instanceof Node && base !== document.body) {
      this.root = base;
    } else {
      this.root = document.createElement("div");
      document.body.appendChild(this.root);
    }
  }

  render(main, globals, styles) {
    if (typeof main != "undefined") {
      render(
        h(Root, { globals: globals }, [
          h('style', { dangerouslySetInnerHTML: { __html: styles }}),
          h(main, { key: "$MAIN" })
        ]),
        this.root
      );
    }
  }
}
