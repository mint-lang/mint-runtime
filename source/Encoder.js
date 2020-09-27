import Record from "./Record";

const identity = (value) => value;
const time = (value) => +value;

const map = (value) => {
  const result = {};

  for (let item of value) {
    result[item[0]] = item[1];
  }

  return result;
};

const maybe = (enums) => (value) => {
  if (value instanceof enums.just) {
    return value._0;
  } else {
    return null;
  }
};

export default (enums) => ({
  maybe: maybe(enums),
  identity: identity,
  time: time,
  map: map,
});
