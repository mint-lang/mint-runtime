import { Equals, Name } from "./Symbols";
import Record from "./Record";

export const update = (data, new_data) => {
  const fields = Object.assign(Object.create(null), data, new_data);
  return new Record(fields, data[Name]);
};

export const navigate = (url, dispatch = true) => {
  if (window.location.pathname !== url) {
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

export const normalizeEvent = event => {
  return new Proxy(event, {
    get: function(obj, prop) {
      if (prop in obj) {
        return obj[prop];
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
