import Mint from "./Main.js";

const { Enum, compare } = Mint;

class TestEnum extends Enum {}

class TestEnum2 extends Enum {
  constructor(_0, _1) {
    super();

    this._0 = _0;
    this._1 = _1;

    this.length = 2;
  }
}

describe("equality", () => {
  test("same intance equals true", () => {
    expect(compare(new TestEnum(), new TestEnum())).toEqual(true);
  });

  test("same parameters equals true", () => {
    expect(compare(new TestEnum2("0", "1"), new TestEnum2("0", "1"))).toEqual(
      true
    );
  });

  test("different instances equals false", () => {
    expect(compare(new TestEnum2("0", "2"), new TestEnum())).toEqual(false);
  });

  test("different lengths equals false", () => {
    const a = new TestEnum2("0", "2");
    const b = new TestEnum2("0", "2");
    b.length = 10;

    expect(compare(a, b)).toEqual(false);
  });

  test("different parameters equals false", () => {
    expect(compare(new TestEnum2("0", "2"), new TestEnum2("0", "1"))).toEqual(
      false
    );
  });
});
