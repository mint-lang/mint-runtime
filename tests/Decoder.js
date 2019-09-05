import { Error, format } from "../source/Decoder.js";
import Mint from "../source/Main.js";

const { Decoder, Err, Ok, Just, Nothing } = Mint;

describe("format", () => {
  test("it returns undefined for undefined", () => {
    expect(format(undefined)).toEqual(" undefined");
  });
});

describe("field", () => {
  test("Not an Object", () => {
    const result = Decoder.field("", Decoder.string)([]);

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
  });

  test("Missing key", () => {
    const result = Decoder.field("", Decoder.string)({});

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
  });

  test("Propagated error", () => {
    const input = { blah: 0 };
    const result = Decoder.field("blah", Decoder.string)(input);

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
    expect(result.value.object).toBe(input);
    expect(result.value.path.length).toBe(1);
  });

  test("ok", () => {
    const result = Decoder.field("blah", Decoder.string)({ blah: "Hello" });

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toBe("Hello");
  });
});

describe("string", () => {
  test("error", () => {
    const result = Decoder.string(0);

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
  });

  test("ok", () => {
    const result = Decoder.string("blah");

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toBe("blah");
  });
});

describe("number", () => {
  test("error", () => {
    const result = Decoder.number("asd");

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
  });

  test("ok", () => {
    const result = Decoder.number(0.123);

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toBe(0.123);
  });
});

describe("time", () => {
  test("error", () => {
    const result = Decoder.time("asd");

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
  });

  test("ok (string)", () => {
    const result = Decoder.time("2018-06-03T06:24:48.319Z");

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toBeInstanceOf(Date);
  });

  test("ok (number)", () => {
    const result = Decoder.time(100);

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toBeInstanceOf(Date);
  });
});

describe("boolean", () => {
  test("error", () => {
    const result = Decoder.boolean("asd");

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
  });

  test("ok", () => {
    const result = Decoder.boolean(true);

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toBe(true);
  });
});

describe("array", () => {
  test("error", () => {
    const result = Decoder.array(Decoder.string)("asd");

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
  });

  test("item error", () => {
    const input = [0];
    const result = Decoder.array(Decoder.string)(input);

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
    expect(result.value.object).toBe(input);
    expect(result.value.path.length).toBe(1);
  });

  test("ok", () => {
    const result = Decoder.array(Decoder.string)(["asd"]);

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toEqual(["asd"]);
  });
});

describe("maybe", () => {
  test("error", () => {
    const result = Decoder.maybe(Decoder.string)(0);

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
  });

  test("undefined", () => {
    const result = Decoder.maybe(Decoder.string)(undefined);

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toBeInstanceOf(Nothing);
  });

  test("null", () => {
    const result = Decoder.maybe(Decoder.string)(null);

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toBeInstanceOf(Nothing);
  });

  test("ok", () => {
    const result = Decoder.maybe(Decoder.string)("asd");

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toBeInstanceOf(Just);
    expect(result.value.value).toBe("asd");
  });
});

describe("map", () => {
  test("error", () => {
    const result = Decoder.map(Decoder.string)(0);

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
  });

  test("array", () => {
    const result = Decoder.map(Decoder.string)([]);

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
  });

  test("invalid value", () => {
    const map = { a: 0 };
    const result = Decoder.map(Decoder.string)(map);

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
  });

  test("ok", () => {
    const map = { a: "1" };
    const result = Decoder.map(Decoder.string)(map);

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toBeInstanceOf(Map);
  });
});

describe("complex error", () => {
  test("returns nice message", () => {
    const input = {
      level1: [
        {
          sub: {
            sub2: {
              sub3: [1]
            }
          }
        }
      ]
    };

    const decoder = Decoder.field(
      "level1",
      Decoder.array(
        Decoder.field(
          "sub",
          Decoder.field(
            "sub2",
            Decoder.field("sub3", Decoder.array(Decoder.string))
          )
        )
      )
    );

    const result = decoder(input);

    expect(result.value).toBeInstanceOf(Error);
    expect(typeof result.value.toString()).toBe("string");
    expect(result.value.object).toBe(input);
    expect(result.value.path.length).toBe(6);
  });
});
