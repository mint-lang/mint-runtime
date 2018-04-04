import Main from '../source/Main.js'

const { compare, Ok, Err } = Main

test("comparing same errors", () => {
  expect(compare(new Err("A"), new Err("A"))).toBe(true);
});

test("comparing with different type", () => {
  expect(compare(new Err("A"), "A")).toBe(false);
});

test("comparing same values", () => {
  expect(compare(new Ok("A"), new Ok("A"))).toBe(true);
});
