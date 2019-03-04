import { compare } from "./Compare";
import { Equals } from "./Symbols";
import { Err, Ok } from "./Result";
import Decoder from "./Decoder";

export class Record {
  constructor(data) {
    for (let key in data) {
      this[key] = data[key];
    }
  }

  [Equals](other) {
    if (!(other instanceof Record)) {
      return false;
    }

    if (Object.keys(this).length !== Object.keys(other).length) {
      return false;
    }

    for (let key in this) {
      if (!compare(other[key], this[key])) {
        return false;
      }
    }

    return true;
  }
}

export const create = mappings => {
  const item = class extends Record {};
  item.mappings = mappings;
  item.decode = _input => {
    const object = {};

    for (let key in mappings) {
      const [otherKey, decoder] = mappings[key];
      const result = Decoder.field(otherKey, decoder)(_input);

      if (result instanceof Err) {
        return result;
      }

      object[key] = result.value;
    }

    return new Ok(new item(object));
  };

  return item;
};

export default Record;
