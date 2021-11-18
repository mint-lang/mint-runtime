import indentString from "indent-string";

export const format = (value) => {
  let string = JSON.stringify(value, "", 2);

  if (typeof string === "undefined") {
    string = "undefined";
  }

  return indentString(string);
};

export class Error {
  constructor(message, path = []) {
    this.message = message;
    this.object = null;
    this.path = path;
  }

  push(input) {
    this.path.unshift(input);
  }

  toString() {
    const message = this.message.trim();

    const path = this.path.reduce((memo, item) => {
      if (memo.length) {
        switch (item.type) {
          case "FIELD":
            return `${memo}.${item.value}`;
          case "ARRAY":
            return `${memo}[${item.value}]`;
        }
      } else {
        switch (item.type) {
          case "FIELD":
            return item.value;
          case "ARRAY":
            return `[$(item.value)]`;
        }
      }
    }, "");

    if (path.length && this.object) {
      return (
        message +
        "\n\n" +
        IN_OBJECT.trim()
          .replace("{value}", format(this.object))
          .replace("{path}", path)
      );
    } else {
      return message;
    }
  }
}

const IN_OBJECT = `
The input is in this object:

{value}

at: {path}
`;

const NOT_A_STRING = `
I was trying to decode the value:

{value}

as a String, but could not.
`;

const NOT_A_TIME = `
I was trying to decode the value:

{value}

as a Time, but could not.
`;

const NOT_A_NUMBER = `
I was trying to decode the value:

{value}

as a Number, but could not.
`;

const NOT_A_BOOLEAN = `
I was trying to decode the value:

{value}

as a Bool, but could not.
`;

const NOT_AN_OBJECT = `
I was trying to decode the field "{field}" from the object:

{value}

but I could not because it's not an object.
`;

const NOT_AN_ARRAY = `
I was trying to decode the value:

{value}

as an Array, but could not.
`;

const NOT_A_TUPLE = `
I was trying to decode the value:

{value}

as an Tuple, but could not.
`;

const TUPLE_ITEM_MISSING = `
I was trying to decode one of the values of a tuple:

{value}

but could not.
`;

const NOT_A_MAP = `
I was trying to decode the value:

{value}

as a Map, but could not.
`;

const string = (enums) => (input) => {
  const { ok, err } = enums;

  if (typeof input != "string") {
    return new err(new Error(NOT_A_STRING.replace("{value}", format(input))));
  } else {
    return new ok(input);
  }
};

const time = (enums) => (input) => {
  const { ok, err } = enums;

  let parsed = NaN;

  if (typeof input === "number") {
    parsed = new Date(input);
  } else {
    parsed = Date.parse(input);
  }

  if (Number.isNaN(parsed)) {
    return new err(new Error(NOT_A_TIME.replace("{value}", format(input))));
  } else {
    return new ok(new Date(parsed));
  }
};

const number = (enums) => (input) => {
  const { ok, err } = enums;

  let value = parseFloat(input);

  if (isNaN(value)) {
    return new err(new Error(NOT_A_NUMBER.replace("{value}", format(input))));
  } else {
    return new ok(value);
  }
};

const boolean = (enums) => (input) => {
  const { ok, err } = enums;

  if (typeof input != "boolean") {
    return new err(new Error(NOT_A_BOOLEAN.replace("{value}", format(input))));
  } else {
    return new ok(input);
  }
};

const field = (enums) => (key, decoder) => {
  const { err, nothing } = enums;

  return (input) => {
    if (
      input == null ||
      input == undefined ||
      typeof input !== "object" ||
      Array.isArray(input)
    ) {
      const message = NOT_AN_OBJECT.replace("{field}", key).replace(
        "{value}",
        format(input)
      );

      return new err(new Error(message));
    } else {
      const actual = input[key];

      const decoded = decoder(actual);

      if (decoded instanceof err) {
        decoded._0.push({ type: "FIELD", value: key });
        decoded._0.object = input;
      }

      return decoded;
    }
  };
};

const array = (enums) => (decoder) => {
  return (input) => {
    const { ok, err } = enums;

    if (!Array.isArray(input)) {
      return new err(new Error(NOT_AN_ARRAY.replace("{value}", format(input))));
    }

    let results = [];
    let index = 0;

    for (let item of input) {
      let result = decoder(item);

      if (result instanceof err) {
        result._0.push({ type: "ARRAY", value: index });
        result._0.object = input;
        return result;
      } else {
        results.push(result._0);
      }

      index++;
    }

    return new ok(results);
  };
};

const maybe = (enums) => (decoder) => {
  return (input) => {
    const { ok, just, nothing, err } = enums;

    if (input == null || input == undefined) {
      return new ok(new nothing());
    } else {
      const result = decoder(input);

      if (result instanceof err) {
        return result;
      } else {
        return new ok(new just(result._0));
      }
    }
  };
};

const tuple = (enums) => (decoders) => {
  return (input) => {
    const { ok, err } = enums;

    if (!Array.isArray(input)) {
      return new err(new Error(NOT_A_TUPLE.replace("{value}", format(input))));
    }

    let results = [];
    let index = 0;

    for (let decoder of decoders) {
      if (input[index] === undefined || input[index] === null) {
        return new err(
          new Error(TUPLE_ITEM_MISSING.replace("{value}", format(input[index])))
        );
      } else {
        let result = decoder(input[index]);

        if (result instanceof err) {
          result._0.push({ type: "ARRAY", value: index });
          result._0.object = input;
          return result;
        } else {
          results.push(result._0);
        }
      }

      index++;
    }

    return new ok(results);
  };
};

const map = (enums) => (decoder) => {
  return (input) => {
    const { ok, err } = enums;

    if (
      input == null ||
      input == undefined ||
      typeof input !== "object" ||
      Array.isArray(input)
    ) {
      const message = NOT_A_MAP.replace("{value}", format(input));

      return new err(new Error(message));
    } else {
      const map = [];

      for (let key in input) {
        const result = decoder(input[key]);

        if (result instanceof err) {
          return result;
        } else {
          map.push([key, result._0]);
        }
      }

      return new ok(map);
    }
  };
};

const object = (enums) => (input) => new enums.ok(input);

export default (enums) => ({
  boolean: boolean(enums),
  object: object(enums),
  number: number(enums),
  string: string(enums),
  field: field(enums),
  array: array(enums),
  maybe: maybe(enums),
  tuple: tuple(enums),
  time: time(enums),
  map: map(enums),
});
