import Record from "./Record";

export const update = (data, newData) => {
  const updatedData = Object.assign(Object.create(null), data, newData);

  if (data instanceof Record) {
    return new data.constructor(updatedData);
  } else {
    return new Record(updatedData);
  }
};

export const navigate = (url, dispatch = true, triggerJump = true, routeInfo = null) => {
  let pathname = window.location.pathname;
  let search = window.location.search;
  let hash = window.location.hash;
  let fullPath = pathname + search + hash;

  if (fullPath !== url) {
    if (dispatch) {
      window.history.pushState({}, "", url);
    } else {
      window.history.replaceState({}, "", url);
    }
  }
  if (dispatch) {
    let event = new PopStateEvent("popstate");
    event.triggerJump = triggerJump;
    event.routeInfo = routeInfo;
    dispatchEvent(event);
  }
};

export const insertStyles = (styles) => {
  let style = document.createElement("style");
  document.head.appendChild(style);
  style.innerHTML = styles;
};

export const at = (enums) => (array, index) => {
  const { just, nothing } = enums;

  if (array.length >= index + 1 && index >= 0) {
    return new just(array[index]);
  } else {
    return new nothing();
  }
};

class DataTransfer {
  constructor() {
    this.effectAllowed = "none";
    this.dropEffect = "none";
    this.files = [];
    this.types = [];
    this.cache = {};
  }

  getData(format) {
    return this.cache[format] || "";
  }

  setData(format, data) {
    this.cache[format] = data;
    return null;
  }

  clearData() {
    this.cache = {};
    return null;
  }
}

export const normalizeEvent = (event) => {
  return new Proxy(event, {
    get: function (obj, prop) {
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
            return (obj.clipboardData = new DataTransfer());

          // drag events
          case "dataTransfer":
            return (obj.dataTransfer = new DataTransfer());

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
    },
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

export const setConstants = (target, object) => {
  if (!object) {
    return;
  }
  const properties = {};

  Object.keys(object).forEach((key) => {
    let value = null;

    properties[key] = {
      get: () => {
        if (!value) {
          value = object[key]();
        }
        return value;
      },
    };
  });

  Object.defineProperties(target, properties);
};

export const array = function () {
  let items = Array.from(arguments);
  if (Array.isArray(items[0]) && items.length === 1) {
    return items[0];
  } else {
    return items;
  }
};

export const style = function (items) {
  const result = {};

  const setKeyValue = (key, value) => {
    result[key.toString().trim()] = value.toString().trim();
  };

  for (let item of items) {
    if (typeof item === "string") {
      item.split(";").forEach((prop) => {
        const [key, value] = prop.split(":");

        if (key && value) {
          setKeyValue(key, value);
        }
      });
    } else if (item instanceof Map) {
      for (let [key, value] of item) {
        setKeyValue(key, value);
      }
    } else if (item instanceof Array) {
      for (let [key, value] of item) {
        setKeyValue(key, value);
      }
    } else {
      for (let key in item) {
        setKeyValue(key, item[key]);
      }
    }
  }

  return result;
};
