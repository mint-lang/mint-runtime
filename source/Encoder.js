import Record from "./Record";

const identity = (value) => value;

const time = (value) => {
  const tzo = -value.getTimezoneOffset();
  const dif = tzo >= 0 ? "+" : "-";
  const pad = (num) => {
    const norm = Math.floor(Math.abs(num));
    return (norm < 10 ? "0" : "") + norm;
  };

  return (
    value.getFullYear() +
    "-" +
    pad(value.getMonth() + 1) +
    "-" +
    pad(value.getDate()) +
    "T" +
    pad(value.getHours()) +
    ":" +
    pad(value.getMinutes()) +
    ":" +
    pad(value.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ":" +
    pad(tzo % 60)
  );
};

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

export default (enums) => ({
  maybe: maybe(enums),
  identity: identity,
  array: array,
  time: time,
  map: map,
});
