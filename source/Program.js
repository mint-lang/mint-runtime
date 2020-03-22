import { Component, h, render } from "preact";
import RouteParser from "route-parser";
import "event-propagation-path";

import { navigate } from "./Utils";

class Root extends Component {
  handleClick(event, routes) {
    // If someone prevented default we honor that.
    if (event.defaultPrevented) {
      return;
    }

    // If the control is pressed it means that the user wants
    // to open it a new tab so we honor that.
    if (event.ctrlKey) {
      return;
    }

    for (let element of event.propagationPath()) {
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
    const components = [];

    for (let key in this.props.globals) {
      components.push(
        h(this.props.globals[key], {
          ref: item => item._persist(),
          key: key
        })
      );
    }

    return h("div", { onClick: this.handleClick.bind(this) }, [
      ...components,
      ...this.props.children
    ]);
  }
}

Root.displayName = "Mint.Root";

export default enums => {
  return class Program {
    constructor() {
      this.root = document.createElement("div");
      document.body.appendChild(this.root);
      this.routes = [];

      this.shadow = this.root.attachShadow({mode: 'open'});

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

    render(main, globals, styles) {
      if (typeof main !== "undefined") {
        render(
          h(Root, { routes: this.routes, globals: globals }, [
            h('style', { dangerouslySetInnerHTML: { __html: styles }}),
            h(main, { key: "$MAIN" })
          ]),
          this.shadow
        );

        requestAnimationFrame(() => {
          this.handlePopState();
        });
      }
    }

    addRoutes(routes) {
      this.routes = this.routes.concat(routes);
    }
  };
};
