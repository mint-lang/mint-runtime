import Mint from "../source/Main.js";

test("comparing same symbols", () => {
  expect(Mint.compare(Symbol("A"), Symbol("A"))).toBe(false);
});

test("comparing same arrays", () => {
  expect(["A"] == ["A"]).toBe(false);
  expect(Mint.compare(["A"], ["A"])).toBe(true);
});

test("comparing empty arrays", () => {
  expect([] == []).toBe(false);
  expect(Mint.compare([], [])).toBe(true);
});

test("comparing different length arrays", () => {
  expect(["A"] == ["A"]).toBe(false);
  expect(Mint.compare(["A", "B"], ["A"])).toBe(false);
});

test("comparing different arrays", () => {
  expect(Mint.compare(["A"], ["B"])).toBe(false);
});

test("comparing same dates", () => {
  expect(new Date() == new Date()).toBe(false);
  expect(Mint.compare(new Date(), new Date())).toBe(true);
});

test("comparing different dates", () => {
  expect(Mint.compare(new Date(2018, 1, 1), new Date(2018, 1, 2))).toBe(false);
});

test("comparing same strings", () => {
  expect(Mint.compare("A", "A")).toBe(true);
});

test("comparing same numbers", () => {
  expect(Mint.compare(0, 0.0)).toBe(true);
});

test("comparing booleans", () => {
  expect(Mint.compare(true, true)).toBe(true);
});

describe("FormData", () => {
  test("empty form datas are equal", () => {
    expect(Mint.compare(new FormData(), new FormData())).toBe(true);
  });

  test("same data form datas are equal", () => {
    const a = new FormData();
    a.append("a", "a");

    const b = new FormData();
    b.append("a", "a");

    expect(Mint.compare(a, b)).toBe(true);
  });

  test("different datas are not equal", () => {
    const a = new FormData();
    a.append("a", "a");

    const b = new FormData();
    b.append("b", "a");

    expect(Mint.compare(a, b)).toBe(false);
  });

  test("different datas are not equal", () => {
    const a = new FormData();
    a.append("a", "b");

    const b = new FormData();
    b.append("a", "a");

    expect(Mint.compare(a, b)).toBe(false);
  });

  test("same multiple data form datas are equal", () => {
    const a = new FormData();
    a.append("a", "a");
    a.append("a", "b");

    const b = new FormData();
    b.append("a", "b");
    b.append("a", "a");

    expect(Mint.compare(a, b)).toBe(true);
  });
});
