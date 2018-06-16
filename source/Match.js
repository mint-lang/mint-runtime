import { Err, Ok } from "./Result";
import { Name } from "./Symbols";
import { Just } from "./Maybe";

export const match = (a, type) => {
  if (a != undefined && a != null && a[Name]) {
    if (a[Name] != type.name) {
      return false;
    } else if (type.name == "Array") {
      const first = a[0];

      if (first != undefined && first != null) {
        return match(first, type.parameters[0]);
      } else {
        return true;
      }
    } else if (a instanceof Just) {
      return match(a.value, type.parameters[0]);
    } else if (a instanceof Err) {
      return match(a.value, type.parameters[0]);
    } else if (a instanceof Ok) {
      return match(a.value, type.parameters[1]);
    } else {
      return true;
    }
  } else {
    console.warn(`Could not match "${a}" to ${type} because it has no type!`);
    return false;
  }
};
