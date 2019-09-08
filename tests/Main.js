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

export default Main({ err: Err, ok: Ok, just: Just, nothing: Nothing });

test("it passes", () => {});
