import {
  $Object_Error_MissingObjectKey,
  $Object_Error_NotAValidTime,
  $Object_Error_NotABoolean,
  $Object_Error_NotAnObject,
  $Object_Error_NotAnArray,
  $Object_Error_NotAString,
  $Object_Error_NotANumber
} from "../source/Decoder.js";
import Mint from "../source/Main.js";

const { Decoder, Err, Ok, Just, Nothing } = Mint;

describe("field", () => {
  test("Not an Object", () => {
    const result = Decoder.field("", Decoder.string)([]);

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBe($Object_Error_NotAnObject);
  });

  test("Missing key", () => {
    const result = Decoder.field("", Decoder.string)({});

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBe($Object_Error_MissingObjectKey);
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
    expect(result.value).toBe($Object_Error_NotAString);
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
    expect(result.value).toBe($Object_Error_NotANumber);
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
    expect(result.value).toBe($Object_Error_NotAValidTime);
  });

  test("ok", () => {
    const result = Decoder.time("2018-06-03T06:24:48.319Z");

    expect(result).toBeInstanceOf(Ok);
    expect(result.value).toBeInstanceOf(Date);
  });
});

describe("boolean", () => {
  test("error", () => {
    const result = Decoder.boolean("asd");

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBe($Object_Error_NotABoolean);
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
    expect(result.value).toBe($Object_Error_NotAnArray);
  });

  test("item error", () => {
    const result = Decoder.array(Decoder.string)([0]);

    expect(result).toBeInstanceOf(Err);
    expect(result.value).toBe($Object_Error_NotAString);
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
    expect(result.value).toBe($Object_Error_NotAString);
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
