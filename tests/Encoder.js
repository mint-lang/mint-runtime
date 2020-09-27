import Mint from "./Main.js";

const { Encoder, Just, Nothing, createRecord } = Mint;

const X = createRecord({
  a: ["x-y-z", null, Encoder.identity],
  c: ["c", null, null],
});

describe("Encoder.identity", () => {
  test("returns value", () => {
    expect(Encoder.identity("")).toBe("");
    expect(Encoder.identity(0)).toBe(0);
  });
});

describe("Encoder.time", () => {
  test("converts it to integer", () => {
    expect(Encoder.time(new Date(2020, 0, 1))).toBe(1577836800000);
  });
});

describe("Encoder.maybe", () => {
  test("Nothing", () => {
    const result = Encoder.maybe(new Nothing());
    expect(result).toBe(null);
  });

  test("Just", () => {
    const result = Encoder.maybe(new Just("a"));
    expect(result).toBe("a");
  });
});

describe("Record", () => {
  test("encodes", () => {
    const result = X.encode(new X({ a: "B", c: 0 }));

    expect(result).not.toBeInstanceOf(X);
    expect(result.a).toBe(undefined);
    expect(result["x-y-z"]).toBe("B");
    expect(result.c).toBe(0);
  });
});

describe("Map", () => {
  test("encodes", () => {
    const result = Encoder.map([
      ["a", "B"],
      ["c", "0"],
    ]);

    expect(result).not.toBeInstanceOf(Map);
    expect(result.a).toBe("B");
    expect(result.c).toBe("0");
  });
});
