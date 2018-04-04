import Main from "../source/Main.js";

const { compare, Record } = Main;

test("comparing two identical records", () => {
  const a = new Record({ name: "Joe" });
  const b = new Record({ name: "Joe" });

  expect(compare(a, b)).toBe(true);
});

test("comparing the same record", () => {
  const a = new Record({ name: "Joe" });

  expect(compare(a, a)).toBe(true);
});

test("comparing different records", () => {
  const a = new Record({ name: "Joe" });
  const b = new Record({ name: "Doe" });

  expect(compare(a, b)).toBe(false);
});

test("comparing records with not matching keys", () => {
  const a = new Record({ name: "Joe" });
  const b = new Record({ b: "Doe" });

  expect(compare(a, b)).toBe(false);
});

test("comparing records with different number of keys", () => {
  const a = new Record({ name: "Joe" });
  const b = new Record({ name: "Joe", gender: "male" });

  expect(compare(a, b)).toBe(false);
});

test("comparing records with something else", () => {
  const a = new Record({ name: "Joe" });

  expect(compare(a, "A")).toBe(false);
});
