import ReactDOM from "react-dom";
import React from "react";

class Root extends React.Component {
  render() {
    const components = [];

    for (let key in this.props.globals) {
      components.push(
        React.createElement(this.props.globals[key], {
          ref: item => item._persist(),
          key: key
        })
      );
    }

    return React.createElement("div", {}, [
      ...components,
      ...this.props.children
    ]);
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

  render(main, globals) {
    if (typeof main != "undefined") {
      ReactDOM.render(
        React.createElement(Root, { globals: globals }, [
          React.createElement(main, { key: "$MAIN" })
        ]),
        this.root
      );
    }
  }
}
