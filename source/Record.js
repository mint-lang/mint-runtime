import { compare } from "./Compare";
import { Equals } from "./Symbols";

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

export const create = (Decoder, enums) => (mappings) => {
  const item = class extends Record {};

  item.mappings = mappings;
  item.decode = (_input) => {
    const { ok, err } = enums;
    const object = {};

    for (let key in mappings) {
      const [otherKey, decoder] = mappings[key];
      const result = Decoder.field(otherKey, decoder)(_input);

      if (result instanceof err) {
        return result;
      }

      object[key] = result._0;
    }

    return new ok(new item(object));
  };

  return item;
};

export default Record;
