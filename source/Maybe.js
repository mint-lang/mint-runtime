import { Equals, Name } from "./Symbols";
import { compare } from "./Compare";

class Maybe {
  get [Name]() {
    return "Maybe";
  }
}

export class Nothing extends Maybe {
  [Equals](other) {
    return other instanceof Nothing;
  }
}

export class Just extends Maybe {
  constructor(value) {
    super();
    this.value = value;
  }

  [Equals](other) {
    if (other instanceof Just) {
      return compare(other.value, this.value);
    } else {
      return false;
    }
  }
}
