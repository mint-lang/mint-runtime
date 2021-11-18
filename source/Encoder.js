import Record from "./Record";

const identity = (value) => value;
const time = (value) => value.toISOString();

const array = (encoder) => (value) => {
  return value.map((item) => {
    return encoder ? encoder(item) : item;
  });
};

const map = (encoder) => (value) => {
  const result = {};

  for (let item of value) {
    result[item[0]] = encoder ? encoder(item[1]) : item[1];
  }

  return result;
};

const maybe = (enums) => (encoder) => (value) => {
  if (value instanceof enums.just) {
    return encoder ? encoder(value._0) : value._0;
  } else {
    return null;
  }
};

const tuple = (encoders) => (value) => {
  return value.map((item, index) => {
    const encoder = encoders[index];
    return encoder ? encoder(item) : item;
  });
};

export default (enums) => ({
  maybe: maybe(enums),
  identity: identity,
  tuple: tuple,
  array: array,
  time: time,
  map: map,
});
