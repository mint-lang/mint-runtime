import Mint from "../source/Main.js";

const { Module } = Mint;

class TestModule extends Module {
  boundFn() {
    return this
  }
}

describe("Module", () => {
  test("functions are bound", () => {
    const instance = new TestModule()
    expect(instance.boundFn()).toEqual(instance);
  });
});
