import { Component, h, render } from "preact";
import Main from "./Main.js";

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

const { EmbeddedProgram } = Main;

describe("render", () => {
  test("it does nothing if there is no main component", () => {
    new EmbeddedProgram().render();
  });

  test("it renders it into the body", () => {
    new EmbeddedProgram(document.body).render();
  });

  test("it renders it into an element", () => {
    new EmbeddedProgram(document.createElement("div")).render();
  });

  test("it renders the main component", () => {
    const program = new EmbeddedProgram();
    program.render($Main);

    expect(program.root.querySelector("div").textContent).toBe("TEST");
  });

  test("it renders globals component", done => {
    const program = new EmbeddedProgram();
    program.render($Main, { A: $Global });

    expect(program.root.querySelector("span").textContent).toBe("GLOBAL");
    requestAnimationFrame(() => done());
  });
});
