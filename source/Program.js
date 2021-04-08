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
        // If the target is not empty then it's probably _blank or
        // an other window or frame so we skip.
        if (element.target.trim() !== "") { return }

        let pathname = element.pathname;
        let origin = element.origin;
        let search = element.search;
        let hash = element.hash;

        if (origin === window.location.origin) {
          for (let item of this.props.routes) {
            let partialPath = pathname + search;
            let fullPath = partialPath + hash;
            let path = new RouteParser(item.path);
            let match = item.path == "*" ? true : path.match(fullPath);

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
          ref: (item) => item._persist(),
          key: key,
        })
      );
    }

    return h("div", { onClick: this.handleClick.bind(this) }, [
      ...components,
      ...this.props.children,
    ]);
  }
}

Root.displayName = "Mint.Root";

export default (enums) => {
  return class Program {
    constructor() {
      this.root = document.createElement("div");
      document.body.appendChild(this.root);
      this.routes = [];

      window.addEventListener("popstate", () => {
        this.handlePopState();
      });
    }

    resolvePagePosition() {
      // On the next frame.
      requestAnimationFrame(() => {
        let hashAnchor;

        try {
          hashAnchor = this.root.querySelector(
            `a[name="${window.location.hash.slice(1)}"]`
          );
        } finally {
        }

        if (window.location.hash && hashAnchor) {
          // This triggers a jump to the hash.
          window.location.href = window.location.hash;
        } else {
          // Otherwise scroll to the top of the page.
          window.scrollTo(document.body.scrollTop, 0);
        }
      });
    }

    handlePopState() {
      for (let item of this.routes) {
        if (item.path === "*") {
          item.handler();
          this.resolvePagePosition();
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
              this.resolvePagePosition();

              break;
            } catch (_) {}
          }
        }
      }
    }

    render(main, globals) {
      if (typeof main !== "undefined") {
        render(
          h(Root, { routes: this.routes, globals: globals }, [
            h(main, { key: "$MAIN" }),
          ]),
          this.root
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
