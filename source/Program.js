import RouteParser from "route-parser";
import ReactDOM from "react-dom";
import React from "react";

export default class Program {
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

  render() {
    if (typeof $Main != "undefined") {
      this.handlePopState();
      ReactDOM.render(React.createElement($Main), this.root);
    }
  }

  addRoutes(routes) {
    this.routes = this.routes.concat(routes);
  }
}
