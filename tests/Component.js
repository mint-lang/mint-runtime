import Mint from "./Main.js";

const { Component } = Mint;

class TestComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blah: "WTF",
    };

    this._d({
      name: [null, "TestComponent"],
      asd: ["test", "ASDF"],
    });
  }

  get x() {
    "";
  }

  boundFn() {
    return this;
  }
}

describe("Component", () => {
  test("functions are bound", () => {
    const instance = new TestComponent({});
    expect(instance.boundFn()).toEqual(instance);
  });

  test("creates properties", () => {
    const instance = new TestComponent({});
    expect(instance.name).toEqual("TestComponent");
  });

  test("return from props", () => {
    const instance = new TestComponent({ name: "WTF" });
    expect(instance.name).toEqual("WTF");
  });

  test("creates foreign properties", () => {
    const instance = new TestComponent({ test: "Hello" });
    expect(instance.asd).toEqual("Hello");
  });

  test("shouldComponentUpdate", () => {
    const instance = new TestComponent({ test: "Hello" });

    expect(
      instance.shouldComponentUpdate({ test: "Hello" }, { blah: "WTF" })
    ).toEqual(false);

    expect(instance.shouldComponentUpdate({}, {})).toEqual(true);

    expect(
      instance.shouldComponentUpdate({ test: "WTF" }, { blah: "ASD" })
    ).toEqual(true);
  });
});
