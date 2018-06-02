import { Nothing, Just } from "./Maybe";
import { Err, Ok } from "./Result";

const field = (key, decoder) => {
  return input => {
    if (
      input == null ||
      input == undefined ||
      typeof input !== "object" ||
      Array.isArray(input)
    ) {
      return new Err("NOT_AN_OBJECT");
    } else {
      const actual = input[key];
      if (typeof actual === "undefined") {
        return new Err("MISSING_OBJECT_KEY");
      }
      return decoder(actual);
    }
  };
};

const string = input => {
  if (typeof input != "string") {
    return new Err("NOT_A_STRING");
  } else {
    return new Ok(input);
  }
};

const time = input => {
  const parsed = Date.parse(input);

  if (Number.isNaN(parsed)) {
    return new Err("NOT_A_TIME");
  } else {
    return new Ok(new Date(parsed));
  }
};

const number = input => {
  if (typeof input != "number") {
    let value = parseFloat(input);

    if (isNaN(value)) {
      return new Err("NOT_A_NUMBER");
    } else {
      return new Ok(value);
    }
  } else {
    return new Ok(input);
  }
};

const boolean = input => {
  if (typeof input != "boolean") {
    return new Err("NOT_A_BOOLEAN");
  } else {
    return new Ok(input);
  }
};

const array = decoder => {
  return input => {
    if (!Array.isArray(input)) {
      return new Err("NOT_AN_ARRAY");
    }

    let results = [];

    for (let item of input) {
      let result = decoder(item);

      if (result instanceof Err) {
        return result;
      } else {
        results.push(result.value);
      }
    }

    return new Ok(results);
  };
};

const maybe = decoder => {
  return input => {
    if (input == null || input == undefined) {
      return new Nothing();
    } else {
      const result = decoder(input);

      if (result instanceof Err) {
        return result;
      } else {
        return new Just(result.value);
      }
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
};
