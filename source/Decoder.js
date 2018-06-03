import { Nothing, Just } from "./Maybe";
import { Err, Ok } from "./Result";

export const $Object_Error_NotAString = Symbol.for("Object_Error_NotAString");
export const $Object_Error_NotANumber = Symbol.for("Object_Error_NotANumber");
export const $Object_Error_NotAnObject = Symbol.for("Object_Error_NotAnObject");
export const $Object_Error_NotAnArray = Symbol.for("Object_Error_NotAnArray");
export const $Object_Error_NotABoolean = Symbol.for("Object_Error_NotABoolean");
export const $Object_Error_NotAValidTime = Symbol.for(
  "Object_Error_NotAValidTime"
);
export const $Object_Error_MissingObjectKey = Symbol.for(
  "Object_Error_MissingObjectKey"
);

const field = (key, decoder) => {
  return input => {
    if (
      input == null ||
      input == undefined ||
      typeof input !== "object" ||
      Array.isArray(input)
    ) {
      return new Err($Object_Error_NotAnObject);
    } else {
      const actual = input[key];
      if (typeof actual === "undefined") {
        return new Err($Object_Error_MissingObjectKey);
      }
      return decoder(actual);
    }
  };
};

const string = input => {
  if (typeof input != "string") {
    return new Err($Object_Error_NotAString);
  } else {
    return new Ok(input);
  }
};

const time = input => {
  const parsed = Date.parse(input);

  if (Number.isNaN(parsed)) {
    return new Err($Object_Error_NotAValidTime);
  } else {
    return new Ok(new Date(parsed));
  }
};

const number = input => {
  let value = parseFloat(input);

  if (isNaN(value)) {
    return new Err($Object_Error_NotANumber);
  } else {
    return new Ok(value);
  }
};

const boolean = input => {
  if (typeof input != "boolean") {
    return new Err($Object_Error_NotABoolean);
  } else {
    return new Ok(input);
  }
};

const array = decoder => {
  return input => {
    if (!Array.isArray(input)) {
      return new Err($Object_Error_NotAnArray);
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

export default {
  boolean: boolean,
  number: number,
  string: string,
  field: field,
  array: array,
  maybe: maybe,
  time: time
};
