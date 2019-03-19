import Mint from "../source/Main.js";

const { encode, Just, Nothing, Record } = Mint;

class X extends Record {}
X.mappings = { a: "x-y-z" };

describe("encode", () => {
  test("string", () => {
    const result = encode("");
    expect(result).toBe("");
  });

  test("number", () => {
    const result = encode(0);
    expect(result).toBe(0);
  });

  test("null", () => {
    const result = encode(null);
    expect(result).toBe(null);
  });

  test("undefined", () => {
    const result = encode(undefined);
    expect(result).toBe(null);
  });

  test("Nothing", () => {
    const result = encode(new Nothing());
    expect(result).toBe(null);
  });

  test("Just", () => {
    const result = encode(new Just("a"));
    expect(result).toBe("a");
  });

  test("array", () => {
    const result = encode(["a", "b"]);
    expect(result[0]).toBe("a");
    expect(result[1]).toBe("b");
  });

  test("record", () => {
    const result = encode(new X({ a: "B", c: 0 }));

    expect(result).not.toBeInstanceOf(X);
    expect(result.a).toBe(undefined);
    expect(result["x-y-z"]).toBe("B");
    expect(result.c).toBe(0);
  });

  test("map", () => {
    const result = encode(new Map([["a", "B"], ["c", "0"]]));
    expect(result).not.toBeInstanceOf(Map);
    expect(result.a).toBe("B");
    expect(result.c).toBe("0");
  });

  test("anything else", () => {
    const item = new FormData();
    const result = encode(item);
    expect(result).toBe(item);
  });
});
