import indentString from "indent-string";
import { Nothing, Just } from "./Maybe";
import { Err, Ok } from "./Result";

export const format = value => {
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

const MISSING_OBJECT_KEY = `
I was trying to decode the field "{field}" from the object:

{value}

but I could not because it's not an object.
`;

const NOT_A_MAP = `
I was trying to decode the value:

{value}

as a Map, but could not.
`;

const string = input => {
  if (typeof input != "string") {
    return new Err(new Error(NOT_A_STRING.replace("{value}", format(input))));
  } else {
    return new Ok(input);
  }
};

const time = input => {
  const parsed = Date.parse(input);

  if (Number.isNaN(parsed)) {
    return new Err(new Error(NOT_A_TIME.replace("{value}", format(input))));
  } else {
    return new Ok(new Date(parsed));
  }
};

const number = input => {
  let value = parseFloat(input);

  if (isNaN(value)) {
    return new Err(new Error(NOT_A_NUMBER.replace("{value}", format(input))));
  } else {
    return new Ok(value);
  }
};

const boolean = input => {
  if (typeof input != "boolean") {
    return new Err(new Error(NOT_A_BOOLEAN.replace("{value}", format(input))));
  } else {
    return new Ok(input);
  }
};

const field = (key, decoder) => {
  return input => {
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

      return new Err(new Error(message));
    } else {
      const actual = input[key];

      const message = MISSING_OBJECT_KEY.replace("{field}", key).replace(
        "{value}",
        format(input)
      );

      if (typeof actual === "undefined") {
        return new Err(new Error(message));
      }

      const decoded = decoder(actual);

      if (decoded instanceof Err) {
        decoded.value.push({ type: "FIELD", value: key });
        decoded.value.object = input;
      }

      return decoded;
    }
  };
};

const array = decoder => {
  return input => {
    if (!Array.isArray(input)) {
      return new Err(new Error(NOT_AN_ARRAY.replace("{value}", format(input))));
    }

    let results = [];
    let index = 0;

    for (let item of input) {
      let result = decoder(item);

      if (result instanceof Err) {
        result.value.push({ type: "ARRAY", value: index });
        result.value.object = input;
        return result;
      } else {
        results.push(result.value);
      }

      index++;
    }

    return new Ok(results);
  };
};

const maybe = decoder => {
  return input => {
    if (input == null || input == undefined) {
      return new Ok(new Nothing());
    } else {
      const result = decoder(input);

      if (result instanceof Err) {
        return result;
      } else {
        return new Ok(new Just(result.value));
      }
    }
  };
};

const map = decoder => {
  return input => {
    if (
      input == null ||
      input == undefined ||
      typeof input !== "object" ||
      Array.isArray(input)
    ) {
      const message = NOT_A_MAP.replace("{value}", format(input));

      return new Err(new Error(message));
    } else {
      const map = new Map();

      for (let key in input) {
        const result = decoder(input[key]);

        if (result instanceof Err) {
          return result;
        } else {
          map.set(key, result.value);
        }
      }

      return new Ok(map);
    }
  };
};

export default {
  boolean: boolean,
  number: number,
  string: string,
  field: field,
  array: array,
  maybe: maybe,
  time: time,
  map: map
};
