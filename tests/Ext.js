import Mint from "../source/Main.js";

test("comparing same arrays", () => {
  expect(["A"] == ["A"]).toBe(false);
  expect(Mint.compare(["A"], ["A"])).toBe(true);
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
