import { compare } from "./Compare";
import { Equals } from "./Symbols";

class Result {
  constructor(value) {
    this.value = value;
  }

  [Equals](other) {
    if (other instanceof this.constructor) {
      return compare(other.value, this.value);
    } else {
      return false;
    }
  }
}

export class Err extends Result {}
export class Ok extends Result {}
