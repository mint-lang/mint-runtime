import Main from "./Main.js";

const { compare, Record, createRecord, Decoder, Ok, Err } = Main;

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

describe("creating a record", () => {
  it("decodes successfully", () => {
    const C = createRecord({
      a: ["caseInsensitive", Decoder.boolean],
      b: ["multiline", Decoder.boolean],
      c: ["unicode", Decoder.boolean],
      d: ["global", Decoder.boolean],
      e: ["sticky", Decoder.boolean],
    });

    const result = C.decode({
      caseInsensitive: true,
      multiline: true,
      unicode: true,
      global: true,
      sticky: true,
    });

    expect(result instanceof Ok).toBe(true);
    expect(result._0.a).toBe(true);
    expect(result._0.b).toBe(true);
    expect(result._0.c).toBe(true);
    expect(result._0.d).toBe(true);
    expect(result._0.e).toBe(true);
  });

  it("returns an error if can't decode", () => {
    const C = createRecord({
      a: ["caseInsensitive", Decoder.boolean],
      b: ["multiline", Decoder.boolean],
      c: ["unicode", Decoder.boolean],
      d: ["global", Decoder.boolean],
      e: ["sticky", Decoder.boolean],
    });

    const result = C.decode({
      caseInsensitive: "true",
      multiline: true,
      unicode: true,
      global: true,
      sticky: true,
    });

    expect(result instanceof Err).toBe(true);
  });
});
