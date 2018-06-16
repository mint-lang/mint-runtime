import Main from "../source/Main.js";

const { match, Just, Err, Ok, Nothing } = Main;

const result = {
  name: "Result",
  parameters: [{ name: "String" }, { name: "Number" }]
};
console.warn = jest.fn();

test("matching string", () => {
  expect(match("Hello", { name: "String" })).toBe(true);
});

test("matching number", () => {
  expect(match(0, { name: "Number" })).toBe(true);
});

test("matching boolean", () => {
  expect(match(true, { name: "Bool" })).toBe(true);
});

test("matching array", () => {
  expect(match([], { name: "Array", parameters: [{ name: "String" }] })).toBe(
    true
  );
  expect(
    match(["Blah"], { name: "Array", parameters: [{ name: "String" }] })
  ).toBe(true);
  expect(match([0], { name: "Array", parameters: [{ name: "String" }] })).toBe(
    false
  );
});

test("matching Just", () => {
  expect(
    match(new Just("Hello"), {
      name: "Maybe",
      parameters: [{ name: "String" }]
    })
  ).toBe(true);
  expect(
    match(new Just(0), { name: "Maybe", parameters: [{ name: "String" }] })
  ).toBe(false);
});

test("matching Nothing", () => {
  expect(
    match(new Nothing(), { name: "Maybe", parameters: [{ name: "String" }] })
  ).toBe(true);
  expect(match(new Nothing(), { name: "Array" })).toBe(false);
});

test("matching Err", () => {
  expect(match(new Err("Hello"), result)).toBe(true);
  expect(match(new Err(0), result)).toBe(false);
});

test("matching Ok", () => {
  expect(match(new Ok(0), result)).toBe(true);
  expect(match(new Ok("Ok"), result)).toBe(false);
});

test("matching undefined", () => {
  expect(match(undefined, { name: "Test" })).toBe(false);
  expect(console.warn.mock.calls.length).toBe(1);
});
