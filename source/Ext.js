import { Equals } from "./Symbols";
import { compare } from "./Utils";

Date.prototype[Equals] = function(other) {
  return this.toISOString() === other.toISOString();
};

Number.prototype[Equals] = function(other) {
  return this.valueOf() === other;
};

Boolean.prototype[Equals] = function(other) {
  return this.valueOf() === other;
};

String.prototype[Equals] = function(other) {
  return this.valueOf() === other;
};

Array.prototype[Equals] = function(other) {
  if (this.length !== other.length) {
    return false;
  }

  return !!this.filter((item, index) => {
    return compare(item, other[index]);
  }).length;
};
