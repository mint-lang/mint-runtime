import { Equals } from "./Symbols";
import Record from "./Record";

export const update = (data, new_data) => {
  return new Record(Object.assign(Object.create(null), data, new_data));
};

export const navigate = (url, dispatch = true) => {
  let pathname = window.location.pathname;
  let search = window.location.search;
  let hash = window.location.hash;

  let fullPath = pathname + search + hash;

  if (fullPath !== url) {
    window.history.pushState({}, "", url);

    if (dispatch) {
      dispatchEvent(new PopStateEvent("popstate"));
    } else {
    }
  }
};

export const insertStyles = styles => {
  let style = document.createElement("style");
  document.head.appendChild(style);
  style.innerHTML = styles;
};

export const at = enums => (array, index) => {
  const { just, nothing } = enums;

  if (array.length >= index + 1 && index >= 0) {
    return new just(array[index]);
  } else {
    return new nothing();
  }
};

export const normalizeEvent = event => {
  return new Proxy(event, {
    get: function(obj, prop) {
      if (prop in obj) {
        const value = obj[prop];

        if (value instanceof Function) {
          return () => obj[prop]();
        } else {
          return value;
        }
      } else {
        switch (prop) {
          // onCopy onCut onPaste
          case "clipboardData":
            return new DataTransfer();

          // onCompositionEnd onCompositionStart onCompositionUpdate
          case "data":
            return "";

          // onKeyDown onKeyPress onKeyUp
          case "altKey":
            return false;
          case "charCode":
            return -1;
          case "ctrlKey":
            return false;
          case "key":
            return "";
          case "keyCode":
            return -1;
          case "locale":
            return "";
          case "location":
            return -1;
          case "metaKey":
            return false;
          case "repeat":
            return false;
          case "shiftKey":
            return false;
          case "which":
            return -1;

          // onClick onContextMenu onDoubleClick onDrag onDragEnd
          // onDragEnter onDragExit onDragLeave onDragOver onDragStart
          // onDrop onMouseDown onMouseEnter onMouseLeave
          // onMouseMove onMouseOut onMouseOver onMouseUp
          case "button":
            return -1;
          case "buttons":
            return -1;
          case "clientX":
            return -1;
          case "clientY":
            return -1;
          case "pageX":
            return -1;
          case "pageY":
            return -1;
          case "screenX":
            return -1;
          case "screenY":
            return -1;

          // onScroll
          case "detail":
            return -1;

          // onWheel
          case "deltaMode":
            return -1;
          case "deltaX":
            return -1;
          case "deltaY":
            return -1;
          case "deltaZ":
            return -1;

          // onAnimationStart onAnimationEnd onAnimationIteration
          case "animationName":
            return "";
          case "pseudoElement":
            return "";
          case "elapsedTime":
            return -1;

          // onTransitionEnd
          case "propertyName":
            return "";

          default:
            return undefined;
        }
      }
    }
  });
};

export const bindFunctions = (target, exclude) => {
  const descriptors = Object.getOwnPropertyDescriptors(
    Reflect.getPrototypeOf(target)
  );

  for (let key in descriptors) {
    if (exclude && exclude[key]) {
      continue;
    }
    const value = descriptors[key].value;
    if (typeof value !== "function") {
      continue;
    }
    target[key] = value.bind(target);
  }
};

export const array = function() {
  let items = Array.from(arguments);
  if (Array.isArray(items[0]) && items.length === 1) {
    return items[0];
  } else {
    return items;
  }
};

export const style = function(items) {
  const result = {};

  for (let item of items) {
    if (typeof item === "string") {
      item.split(";").forEach(prop => {
        const [key, value] = prop.split(":");

        if (key && value) {
          result[key] = value;
        }
      });
    } else if (item instanceof Map) {
      for (let [key, value] of item) {
        result[key] = value;
      }
    } else {
      for (let key in item) {
        result[key] = item[key];
      }
    }
  }

  return result;
};
