import RouteParser from "route-parser";
import ReactDOM from "react-dom";
import React from "react";

import { navigate } from "./Utils";
import "event-propagation-path";

export default class Program {
  constructor() {
    this.root = document.createElement("div");
    document.body.appendChild(this.root);
    this.routes = [];

    // Handle links
    this.root.addEventListener("click", event => {
      for (let element of event.propagationPath()) {
        if (element.tagName === "A") {
          let origin = element.origin;
          let search = element.search;
          let pathname = element.pathname;

          if (origin === window.location.origin) {
            for (let item of this.routes) {
              let path = new RouteParser(item.path);
              let match = path.match(pathname + search);

              if (match) {
                event.preventDefault();
                navigate(element.href);
                return;
              }
            }
          }
        }
      }
    });

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
          window.location.pathname + window.location.search
        );

        if (match) {
          let args = item.mapping.map(name => {
            return match[name];
          });

          let params = item.mapping.reduce((memo, name) => {
            memo[name] = match[name];
            return memo;
          }, {});

          item.handler.apply(null, args);
          break;
        }
      }
    }
  }

  render(main) {
    if (typeof main != "undefined") {
      this.handlePopState();
      ReactDOM.render(React.createElement(main), this.root);
    }
  }

  addRoutes(routes) {
    this.routes = this.routes.concat(routes);
  }
}
