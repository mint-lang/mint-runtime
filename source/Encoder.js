import { Nothing, Just } from "./Maybe";
import Record from "./Record";

const encode = item => {
  if (item == null || item == undefined) {
    return null;
  } else if (Array.isArray(item)) {
    return item.map(encode);
  } else {
    switch (typeof item) {
      case "string":
      case "boolean":
      case "number":
        return item;
      case "object":
        if (item instanceof Just) {
          return item.value;
        } else if (item instanceof Nothing) {
          return null;
        } else if (item instanceof Map) {
          let result = {};

          item.forEach((value, key) => {
            result[key] = encode(value);
          });

          return result;
        } else if (item instanceof Record) {
          let result = {};

          for (let key in item) {
            const actualKey =
              (item.constructor.mappings && item.constructor.mappings[key]) ||
              key;
            result[actualKey] = encode(item[key]);
          }

          return result;
        }
      default:
        return item;
    }
  }
};

export default encode;
