import { Component, h, render } from "preact";
import Main from "./Main.js";

global.requestIdleCallback = (callback) => callback();
global.scrollTo = jest.fn();

class $Main extends Component {
  render() {
    return h("div", {}, "TEST");
  }
}

class $Global extends Component {
  _persist() {}

  render() {
    return h("span", {}, "GLOBAL");
  }
}

class $Link extends Component {
  render() {
    return h(
      "div",
      {},
      h("a", { href: "/user/5" }),
      h("a", { href: "/blah" }),
      h("a", { href: "https://www.google.com/" }),
      h("a", {
        href: "/user/5",
        onClick: (event) => {
          event.preventDefault();
        },
      }),
      h("a", {
        href: "/user/asd",
      }),
      h("a", { href: "#hash", name: "hash" })
    );
  }
}

const { program, navigate, Decoder } = Main;

const route = {
  path: "/user/:id",
  handler: jest.fn(),
  decoders: [Decoder.number],
  mapping: ["id"],
};

const linkRoute = {
  path: "/user/:id",
  handler: jest.fn(),
  decoders: [Decoder.number],
  mapping: ["id"],
};

const indexRoute = {
  path: "*",
  handler: jest.fn(),
  mapping: [],
};

afterEach(() => {
  jest.resetAllMocks()
});

describe("handling links", () => {
  test("it does not navigate to local link that does not have a route", () => {
    let event = new window.Event("click", { bubbles: true });

    program.routes = [linkRoute];
    program.render($Link);
    program.root.querySelector("a:nth-child(2)").dispatchEvent(event);

    expect(linkRoute.handler.mock.calls.length).toBe(0);
  });

  test("it does not navigate to different origin", () => {
    let event = new window.Event("click", { bubbles: true });

    program.routes = [linkRoute];
    program.render($Link);
    program.root.querySelector("a:nth-child(3)").dispatchEvent(event);

    expect(linkRoute.handler.mock.calls.length).toBe(0);
  });

  test("it does not navigate if default is prevented already", () => {
    let event = new window.Event("click", { bubbles: true, cancelable: true });

    program.routes = [linkRoute];
    program.render($Link);
    program.root.querySelector("a:nth-child(4)").dispatchEvent(event);

    expect(linkRoute.handler.mock.calls.length).toBe(0);
  });

  test("it does not if ctrl key is pressed", () => {
    let event = new window.MouseEvent("click", {
      bubbles: true,
      ctrlKey: true,
    });

    program.routes = [linkRoute];
    program.render($Link);
    program.root.querySelector("a:nth-child(1)").dispatchEvent(event);

    expect(linkRoute.handler.mock.calls.length).toBe(0);
  });

  test("it does not navigates if param type is different", () => {
    let event = new window.Event("click", { bubbles: true });

    program.routes = [linkRoute];
    program.render($Link);
    program.root.querySelector("a:nth-child(5)").dispatchEvent(event);

    expect(linkRoute.handler.mock.calls.length).toBe(0);
  });

  test("it navigates to local link", () => {
    let event = new window.Event("click", { bubbles: true });

    program.routes = [linkRoute];
    program.render($Link);
    program.root.querySelector("a").dispatchEvent(event);

    expect(linkRoute.handler.mock.calls.length).toBe(1);
    expect(linkRoute.handler.mock.calls[0][0]).toBe(5);
  });

  test("it does not prevent native hash behavior", () => {
    let event = new window.Event("click", { bubbles: true });

    program.routes = [indexRoute];
    program.render($Link);
    program.root.querySelector("a:nth-child(6)").dispatchEvent(event);

    expect(linkRoute.handler.mock.calls.length).toBe(0);
  });
});

describe("handling navigation", () => {
  test("handles popstate event", () => {
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  test("calls the handler with proper parameters if matches", () => {
    program.routes = [route];
    navigate("/user/1");
    expect(route.handler.mock.calls.length).toBe(1);
    expect(route.handler.mock.calls[0][0]).toBe(1);
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

  test("it renders globals component", (done) => {
    program.render($Main, { A: $Global });
    expect(program.root.querySelector("span").textContent).toBe("GLOBAL");
    requestAnimationFrame(() => done());
  });
});
