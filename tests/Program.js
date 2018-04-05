import Main from "../source/Main.js";
import React from "react";

class $Main extends React.Component {
  render() {
    return React.createElement("div", {}, "TEST");
  }
}

const { program, navigate } = Main;

const route = {
  path: "/user/:id",
  handler: jest.fn(),
  mapping: ["id"]
};

const indexRoute = {
  path: "*",
  handler: jest.fn(),
  mapping: []
};

describe("handling navigation", () => {
  test("handles popstate event", () => {
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  test("calls the handler with proper parameters if matches", () => {
    program.routes = [route];
    navigate("/user/1");
    expect(route.handler.mock.calls.length).toBe(1);
    expect(route.handler.mock.calls[0][0]).toBe("1");
  });

  test("if it does not match it does nothing", () => {
    program.routes = [route];
    navigate("/blah");
  });

  test("handles index route", () => {
    program.routes = [indexRoute];
    navigate("/user/2");
    expect(indexRoute.handler.mock.calls.length).toBe(1);
  });
});

describe("adding routes", () => {
  test("adds routes", () => {
    program.routes = [];
    program.addRoutes([route]);
    expect(program.routes[0]).toBe(route);
  });
});

describe("render", () => {
  test("it does nothing if there is no main component", () => {
    program.render();
  });

  test("it renders the main component", () => {
    program.render($Main);
    expect(program.root.querySelector("div").textContent).toBe("TEST");
  });
});
