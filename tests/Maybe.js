import Main from '../source/Main.js'

const { compare, Nothing, Just } = Main

test("comparing nothing", () => {
  expect(compare(new Nothing(), new Nothing())).toBe(true);
});

test("comparing nothing to something else", () => {
  expect(compare(new Nothing(), "A")).toBe(false);
});

test("comparing just the same values", () => {
  expect(compare(new Just("A"), new Just("A"))).toBe(true);
});

test("comparing just different values", () => {
  expect(compare(new Just("A"), new Just("B"))).toBe(false);
});

test("comparing just with something", () => {
  expect(compare(new Just("A"), "B")).toBe(false);
});
