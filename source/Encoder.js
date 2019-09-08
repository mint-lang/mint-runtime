import Record from "./Record";

const encode = enums => item => {
  const { just, nothing } = enums;

  if (item == null || item == undefined) {
    return null;
  } else if (Array.isArray(item)) {
    return item.map(encode({ nothing, just }));
  } else {
    switch (typeof item) {
      case "string":
      case "boolean":
      case "number":
        return item;
      case "object":
        if (item instanceof just) {
          return item._0;
        } else if (item instanceof nothing) {
          return null;
        } else if (item instanceof Map) {
          let result = {};

          item.forEach((value, key) => {
            result[key] = encode({ nothing, just })(value);
          });

          return result;
        } else if (item instanceof Record) {
          let result = {};

          for (let key in item) {
            const actualKey =
              (item.constructor.mappings &&
                item.constructor.mappings[key] &&
                item.constructor.mappings[key][0]) ||
              key;
            result[actualKey] = encode({ nothing, just })(item[key]);
          }

          return result;
        }
      default:
        return item;
    }
  }
};

export default encode;
