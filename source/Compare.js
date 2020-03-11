import { Equals } from "./Symbols";

export const compare = (a, b) => {
  if ((a === undefined && b === undefined) || (a === null && b === null)) {
    return true;
  } else if (a != null && a != undefined && a[Equals]) {
    return a[Equals](b);
  } else if (b != null && b != undefined && b[Equals]) {
    return b[Equals](a);
  } else {
    console.warn(`Could not compare "${a}" with "${b}" comparing with ===`);
    return a === b;
  }
};

export const compareObjects = (a, b) => {
  if (a instanceof Object && b instanceof Object) {
    const keys = new Set(Object.keys(a).concat(Object.keys(b)));

    for (let key of keys) {
      if (!compare(a[key], b[key])) {
        return false;
      }
    }

    return true;
  } else {
    console.warn(`Could not compare "${a}" with "${b}" comparing with ===`);
    return a === b;
  }
};
