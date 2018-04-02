import { Equals } from "./Symbols";

export const compare = (a, b) => {
  if (a[Equals]) {
    return a[Equals](b);
  } else {
    if (b[Equals]) {
      return b[Equals](a);
    } else {
      console.warn(
        `Could not compare type ${a} with ${b} falling back to === for comparision`
      );
      return a === b;
    }
  }
};
