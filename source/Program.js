import RouteParser from "route-parser";
import ReactDOM from "react-dom";
import React from "react";

import { navigate } from "./Utils";
import "event-propagation-path";

class Root extends React.Component {
  handleClick(event, routes) {
    const nativeEvent = event.nativeEvent;

    // If someone prevented default we honor that.
    if (event.defaultPrevented) {
      return;
    }

    // If the control is pressed it means that the user wants
    // to open it a new tab so we honor that.
    if (event.ctrlKey) {
      return;
    }

    for (let element of event.nativeEvent.propagationPath()) {
      if (element.tagName === "A") {
        let pathname = element.pathname;
        let origin = element.origin;
        let search = element.search;
        let hash = element.hash;

        if (origin === window.location.origin) {
          for (let item of this.props.routes) {
            let fullPath = pathname + search + hash;
            let path = new RouteParser(item.path);
            let match = path.match(fullPath);

            if (match) {
              event.preventDefault();
              navigate(fullPath);
              return;
            }
          }
        }
      }
    }
  }

  render() {
    return React.createElement(
      "div",
      { onClick: this.handleClick.bind(this) },
      this.props.children
    );
  }
}

Root.displayName = "Mint.Root";

export default enums => {
  return class Program {
    constructor() {
      this.root = document.createElement("div");
      document.body.appendChild(this.root);
      this.routes = [];

      window.addEventListener("popstate", () => {
        this.handlePopState();
      });
    }

    handlePopState() {
      for (let item of this.routes) {
        if (item.path === "*") {
          item.handler();
        } else {
          let path = new RouteParser(item.path);

          let match = path.match(
            window.location.pathname +
              window.location.search +
              window.location.hash
          );

          if (match) {
            try {
              let args = item.mapping.map((name, index) => {
                const value = match[name];
                const result = item.decoders[index](value);

                if (result instanceof enums.ok) {
                  return result._0;
                } else {
                  throw "";
                }
              });

              item.handler.apply(null, args);
              break;
            } catch (_) {}
          }
        }
      }
    }

    render(main) {
      if (typeof main != "undefined") {
        this.handlePopState();
        ReactDOM.render(
          React.createElement(
            Root,
            { routes: this.routes },
            React.createElement(main)
          ),
          this.root
        );
      }
    }

    addRoutes(routes) {
      this.routes = this.routes.concat(routes);
    }
  };
};
