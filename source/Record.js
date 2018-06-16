import { Equals, Name } from "./Symbols";
import { compare } from "./Compare";

export default class Record {
  constructor(data, name) {
    for (let key in data) {
      this[key] = data[key];
    }

    Object.defineProperty(this, Name, {
      value: name
    });
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
