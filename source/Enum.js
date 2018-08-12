import { compare } from "./Compare";
import { Equals } from "./Symbols";

export default class Enum {
  [Equals](other) {
    if (!(other instanceof this.constructor)) {
      return false;
    }

    if (other.length !== this.length) {
      return false;
    }

    for (let index = 0; index < this.length; index++) {
      if (!compare(this["_" + index], other["_" + index])) {
        return false;
      }
    }

    return true;
  }
}
