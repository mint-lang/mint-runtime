import Mint from "./Main.js";

const { Module } = Mint;

class TestModule extends Module {
  constructor() {
    super();
    this._d({
      TEST: () => +new Date(),
    });
  }

  boundFn() {
    return this;
  }
}

describe("Module", () => {
  test("functions are bound", () => {
    const instance = new TestModule();

    expect(instance.boundFn()).toEqual(instance);
  });

  test("sets constructors", () => {
    const instance = new TestModule();
    const test = instance.TEST;

    expect(instance.TEST).toEqual(test);
  });
});
