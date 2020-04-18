import { Equals } from "./Symbols";

const REACT_ELEMENT = Symbol.for("react.element");

export const compare = (a, b) => {
  if ((a === undefined && b === undefined) || (a === null && b === null)) {
    return true;
  } else if (a != null && a != undefined && a[Equals]) {
    return a[Equals](b);
  } else if (b != null && b != undefined && b[Equals]) {
    return b[Equals](a);
  } else if (
    (a && a.$$typeof === REACT_ELEMENT) ||
    (b && b.$$typeof === REACT_ELEMENT)
  ) {
    return a === b;
  } else {
    console.warn(
      "Comparing entites with === because there is no comparison function defined:",
      a,
      b
    );

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
    console.warn(
      "Comparing entites with === because there is no comparison function defined:",
      a,
      b
    );

    return a === b;
  }
};
