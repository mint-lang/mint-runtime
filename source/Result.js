import { Equals, Name } from "./Symbols";
import { compare } from "./Compare";

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

  get [Name]() {
    return "Result";
  }
}

export class Err extends Result {}
export class Ok extends Result {}
