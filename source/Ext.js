import { Equals, Name } from "./Symbols";
import { compare } from "./Compare";

Symbol.prototype[Equals] = function(other) {
  return this.valueOf() === other;
};

Date.prototype[Name] = "Date";
Date.prototype[Equals] = function(other) {
  return +this === +other;
};

Number.prototype[Name] = "Number";
Number.prototype[Equals] = function(other) {
  return this.valueOf() === other;
};

Boolean.prototype[Name] = "Bool";
Boolean.prototype[Equals] = function(other) {
  return this.valueOf() === other;
};

String.prototype[Name] = "String";
String.prototype[Equals] = function(other) {
  return this.valueOf() === other;
};

Array.prototype[Name] = "Array";
Array.prototype[Equals] = function(other) {
  if (this.length !== other.length) {
    return false;
  }

  if (this.length == 0) {
    return true;
  }

  return !!this.filter((item, index) => {
    return compare(item, other[index]);
  }).length;
};

FormData.prototype[Name] == "FormData";
FormData.prototype[Equals] = function(other) {
  const aKeys = Array.from(this.keys());
  const bKeys = Array.from(other.keys());

  if (compare(aKeys, bKeys)) {
    if (aKeys.length == 0) {
      return true;
    }

    return !!aKeys.filter(item => {
      const aValue = Array.from(this.getAll(item).sort());
      const bValue = Array.from(other.getAll(item).sort());
      return compare(aValue, bValue);
    }).length;
  } else {
    return false;
  }
};
