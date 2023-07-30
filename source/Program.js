import { Component, h, render } from "preact";
import RouteParser from "route-parser";
import { deepEqual } from "fast-equals";
import "event-propagation-path";

import { navigate } from "./Utils";

const queueTask = (callback) => {
  if (typeof window.queueMicrotask !== "function") {
    Promise.resolve()
      .then(callback)
      .catch((e) =>
        setTimeout(() => {
          throw e;
        })
      );
  } else {
    window.queueMicrotask(callback);
  }
};

class DecodingError extends Error {}

const equals = (a, b) => {
  if (a instanceof Object) {
    return b instanceof Object && deepEqual(a, b);
  } else {
    return !b instanceof Object && a === b;
  }
};

const getRouteInfo = (url, routes) => {
  for (let route of routes) {
    if (route.path === "*") {
      return { route: route, vars: false };
    } else {
      let vars = new RouteParser(route.path).match(url);
      if (vars) {
        return { route: route, vars: vars };
      }
    }
  }
  return null;
};

class Root extends Component {
  handleClick(event) {
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
        if (element.target.trim() !== "") {
          return;
        }

        if (element.origin === window.location.origin) {
          const fullPath = element.pathname + element.search + element.hash;
          const routes = this.props.routes;
          const routeInfo = getRouteInfo(fullPath, routes);

          if (routeInfo) {
            event.preventDefault();
            navigate(
              fullPath,
              /* dispatch */ true,
              /* triggerJump */ true,
              routeInfo
            );
            return;
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
      this.routeInfo = null;

      window.addEventListener("popstate", (event) => {
        this.handlePopState(event);
      });
    }

    resolvePagePosition(triggerJump, isSameRoute) {
      // Queue a microTask, this will run after Preact does a render.
      queueTask(() => {
        // On the next frame, the DOM should be updated already.
        requestAnimationFrame(() => {
          const hash = window.location.hash;

          if (hash) {
            let elem = null;
            try {
              elem =
                this.root.querySelector(hash) ||
                this.root.querySelector(`a[name="${hash.slice(1)}"]`);
            } finally {
            }

            if (elem) {
              if (triggerJump) {
                if (isSameRoute) {
                  elem.scrollIntoView({ behavior: "smooth" });
                } else {
                  elem.scrollIntoView();
                }
              }
            } else {
              console.warn(
                `${hash} matches no element with an id and no link with a name`
              );
            }
          } else if (triggerJump) {
            if (isSameRoute) {
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } else {
              window.scrollTo(0, 0);
            }
          }
        });
      });
    }

    handlePopState(event) {
      const url =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      const routeInfo = event?.routeInfo || getRouteInfo(url, this.routes);

      if (routeInfo) {
        let isSameRoute = true;

        if (
          this.routeInfo === null ||
          routeInfo.route.path !== this.routeInfo.route.path ||
          !equals(routeInfo.vars, this.routeInfo.vars)
        ) {
          isSameRoute = false;
          this.runRouteHandler(routeInfo);
        }

        this.resolvePagePosition(!!event?.triggerJump, isSameRoute);
      }

      this.routeInfo = routeInfo;
    }

    runRouteHandler(routeInfo) {
      const { route } = routeInfo;
      if (route.path === "*") {
        route.handler();
      } else {
        const { vars } = routeInfo;
        try {
          let args = route.mapping.map((name, index) => {
            const value = vars[name];
            const result = route.decoders[index](value);

            if (result instanceof enums.ok) {
              return result._0;
            } else {
              throw new DecodingError();
            }
          });
          route.handler.apply(null, args);
        } catch (error) {
          if (error.constructor !== DecodingError) {
            throw error;
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

        this.handlePopState();
      }
    }

    addRoutes(routes) {
      this.routes = this.routes.concat(routes);
    }
  };
};
