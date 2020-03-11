import Enum from "../source/Enum";
import Main from "../source/Main";

class Just extends Enum {
  constructor(_0) {
    super();
    this._0 = _0;
    this.length = 1;
  }
}

class Ok extends Enum {
  constructor(_0) {
    super();
    this._0 = _0;
    this.length = 1;
  }
}

class Err extends Enum {
  constructor(_0) {
    super();
    this._0 = _0;
    this.length = 1;
  }
}

class Nothing extends Enum {
  constructor() {
    super();
    this.length = 0;
  }
}

const main = Main({ err: Err, ok: Ok, just: Just, nothing: Nothing });

export default main;

describe("unmountComponentAtNode", () => {
  test("clears the element", () => {
    expect(main.ReactDOM.unmountComponentAtNode(document.createElement("div")));
  });
});
