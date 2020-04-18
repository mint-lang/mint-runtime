import { compare } from "./Compare";
import { Equals } from "./Symbols";

Function.prototype[Equals] = function(other) {
  return this === other;
};

Node.prototype[Equals] = function(other) {
  return this === other;
};

Symbol.prototype[Equals] = function(other) {
  return this.valueOf() === other;
};

Date.prototype[Equals] = function(other) {
  return +this === +other;
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

  if (this.length == 0) {
    return true;
  }

  for (let index in this) {
    if (!compare(this[index], other[index])) {
      return false;
    }
  }

  return true;
};

FormData.prototype[Equals] = function(other) {
  const aKeys = Array.from(this.keys()).sort();
  const bKeys = Array.from(other.keys()).sort();

  if (compare(aKeys, bKeys)) {
    if (aKeys.length == 0) {
      return true;
    }

    for (let key of aKeys) {
      const aValue = Array.from(this.getAll(key).sort());
      const bValue = Array.from(other.getAll(key).sort());

      if (!compare(aValue, bValue)) {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
};

URLSearchParams.prototype[Equals] = function(other) {
  return this.toString() === other.toString();
};

Set.prototype[Equals] = function(other) {
  return compare(Array.from(this).sort(), Array.from(other).sort());
};

Map.prototype[Equals] = function(other) {
  const aKeys = Array.from(this.keys()).sort();
  const bKeys = Array.from(other.keys()).sort();

  if (compare(aKeys, bKeys)) {
    if (aKeys.length == 0) {
      return true;
    }

    for (let key of aKeys) {
      if (!compare(this.get(key), other.get(key))) {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
};
