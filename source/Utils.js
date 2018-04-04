import { Equals } from "./Symbols";
import Record from "./Record";

export const update = (data, new_data) => {
  return new Record(Object.assign(Object.create(null), data, new_data));
};

export const navigate = url => {
  if (window.location.pathname !== url) {
    window.history.pushState({}, "", url);
    dispatchEvent(new PopStateEvent("popstate"));
  }
};

export const insertStyles = styles => {
  let style = document.createElement("style");
  document.head.appendChild(style);
  style.innerHTML = styles;
};
