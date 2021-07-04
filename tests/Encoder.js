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
  test("converts it to an ISO 8601 string (including timezone)", () => {
    const date = new Date(2020, 0, 1);
    expect(Encoder.time(date)).toBe("2020-01-01T00:00:00+00:00");
  });
});

describe("Encoder.maybe", () => {
  test("Nothing", () => {
    const result = Encoder.maybe((value) => value)(new Nothing());
    expect(result).toBe(null);
  });

  test("Just with encoder", () => {
    const result = Encoder.maybe((value) => value)(new Just("a"));
    expect(result).toBe("a");
  });

  test("Just without encoder", () => {
    const result = Encoder.maybe()(new Just("a"));
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
  test("encodes with encoder", () => {
    const result = Encoder.map((value) => value)([
      ["a", "B"],
      ["c", "0"],
    ]);

    expect(result).not.toBeInstanceOf(Map);
    expect(result.a).toBe("B");
    expect(result.c).toBe("0");
  });

  test("encodes without", () => {
    const result = Encoder.map()([
      ["a", "B"],
      ["c", "0"],
    ]);

    expect(result).not.toBeInstanceOf(Map);
    expect(result.a).toBe("B");
    expect(result.c).toBe("0");
  });
});

describe("Array", () => {
  test("encodes with encoder", () => {
    const result = Encoder.array((value) => value)(["B", "0"]);

    expect(result).not.toBeInstanceOf(Map);
    expect(result[0]).toBe("B");
    expect(result[1]).toBe("0");
  });

  test("encodes without encoder", () => {
    const result = Encoder.array()(["B", "0"]);

    expect(result).not.toBeInstanceOf(Map);
    expect(result[0]).toBe("B");
    expect(result[1]).toBe("0");
  });
});
