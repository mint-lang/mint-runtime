import { compare } from "./Compare";
import { Equals } from "./Symbols";

export default class Record {
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
