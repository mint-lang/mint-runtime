import { Equals } from "./Symbols";

export const compare = (a, b) => {
  if (a != null && a != undefined && a[Equals]) {
    return a[Equals](b);
  } else {
    if (b != null && b != undefined && b[Equals]) {
      return b[Equals](a);
    } else {
      console.warn(`Could not compare "${a}" with "${b}" comparing with ===`);
      return a === b;
    }
  }
};
