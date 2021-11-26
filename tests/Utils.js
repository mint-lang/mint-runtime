import { compareObjects } from "../source/Compare.js";
import Main from "./Main.js";

const {
  createRecord,
  compare,
  update,
  Record,
  navigate,
  insertStyles,
  normalizeEvent,
  Just,
  Nothing,
  at,
  array,
  style,
} = Main;

beforeEach(() => {
  console.warn = jest.fn();
});

describe("compareObjects", () => {
  test("compares null and undefined with ===", () => {
    expect(compareObjects(undefined, undefined)).toBe(true);

    expect(console.warn.mock.calls.length).toBe(1);
  });

  test("returns false for not equal objects", () => {
    expect(compareObjects({ a: "A" }, { a: "B" })).toBe(false);
  });
});

describe("compare", () => {
  test("compares null and undefined with ===", () => {
    expect(compare(undefined, undefined)).toBe(true);
    expect(compare(null, undefined)).toBe(false);
    expect(compare(undefined, null)).toBe(false);
    expect(compare(null, null)).toBe(true);

    expect(console.warn.mock.calls.length).toBe(2);
  });

  test("compares with the value that is not null", () => {
    expect(compare(null, "A")).toBe(false);
  });
});

describe("update", () => {
  test("creates a new version of the given record with new data", () => {
    let oldRecord = new Record({ name: "John" });
    let newRecord = update(oldRecord, new Record({ name: "Doe" }));

    expect(compare(newRecord, oldRecord)).toBe(false);
    expect(newRecord.name).toBe("Doe");
  });

  test("it keeps the constructor", () => {
    let TestRecord = createRecord({});
    let testRecord = new TestRecord({});
    let newRecord = update(testRecord, new Record({ name: "Doe" }));

    expect(newRecord).toBeInstanceOf(TestRecord);
    expect(newRecord.name).toBe("Doe");
  });

  test("it creates a record if object is passed", () => {
    let newRecord = update({}, { name: "Doe" });

    expect(newRecord).toBeInstanceOf(Record);
    expect(newRecord.name).toBe("Doe");
  });
});

describe("navigate", () => {
  beforeEach(() => {
    window.dispatchEvent = jest.fn();
  });

  test("navigates to the new URL", () => {
    navigate("/test");
    expect(window.location.pathname).toBe("/test");
    expect(window.dispatchEvent.mock.calls.length).toBe(1);
  });

  test("navigates to the same URL does nothing", () => {
    navigate("/test");
    expect(window.location.pathname).toBe("/test");
    expect(window.dispatchEvent.mock.calls.length).toBe(0);
  });

  test("navigates to the new URL does not dispatch", () => {
    navigate("/testbaha", false);
    expect(window.location.pathname).toBe("/testbaha");
    expect(window.dispatchEvent.mock.calls.length).toBe(0);
  });
});

describe("insertStyles", () => {
  test("adds styles to the document", () => {
    insertStyles("test");
    expect(document.head.querySelector("style").textContent).toBe("test");
  });
});

describe("array", () => {
  test("it an array for not arrays", () => {
    expect(array(0)).toEqual([0]);
  });

  test("doesn't do anything for an array", () => {
    expect(array([0])).toEqual([0]);
  });
});

describe("style", () => {
  test("it creates an object from objects and maps", () => {
    expect(
      style([
        "opacity:0;   z-index:   100   ;  ",
        new Map([["a", "b"]]),
        [["x", "y"]],
        { c: "d" },
      ])
    ).toEqual({
      "z-index": "100",
      opacity: "0",
      a: "b",
      x: "y",
      c: "d",
    });
  });
});

describe("at", () => {
  test("it returns a just for an element", () => {
    let result = at([0], 0);

    expect(result).toBeInstanceOf(Just);
    expect(result._0).toBe(0);
  });

  test("it returns nothing for an element", () => {
    let result = at([0], 1);

    expect(result).toBeInstanceOf(Nothing);
  });

  test("it returns nothing if index is negative", () => {
    let result = at([0], -1);

    expect(result).toBeInstanceOf(Nothing);
  });
});

describe("normalizeEvent", () => {
  test("returns default values if they are not defined", () => {
    const event = normalizeEvent({ test: "X", preventDefault: () => "P" });

    expect(event.dataTransfer).not.toBe(undefined);

    expect(event.dataTransfer.setData("test", "test")).toBe(null);
    expect(event.dataTransfer.getData("not present")).toBe("");
    expect(event.dataTransfer.getData("test")).toBe("test");
    expect(event.dataTransfer.clearData()).toBe(null);

    expect(event.clipboardData).not.toBe(undefined);
    expect(event.preventDefault()).toBe("P");
    expect(event.data).toBe("");
    expect(event.altKey).toBe(false);
    expect(event.charCode).toBe(-1);
    expect(event.ctrlKey).toBe(false);
    expect(event.key).toBe("");
    expect(event.keyCode).toBe(-1);
    expect(event.locale).toBe("");
    expect(event.location).toBe(-1);
    expect(event.metaKey).toBe(false);
    expect(event.repeat).toBe(false);
    expect(event.shiftKey).toBe(false);
    expect(event.which).toBe(-1);
    expect(event.button).toBe(-1);
    expect(event.buttons).toBe(-1);
    expect(event.clientX).toBe(-1);
    expect(event.clientY).toBe(-1);
    expect(event.pageX).toBe(-1);
    expect(event.pageY).toBe(-1);
    expect(event.screenY).toBe(-1);
    expect(event.screenX).toBe(-1);
    expect(event.detail).toBe(-1);
    expect(event.deltaMode).toBe(-1);
    expect(event.deltaX).toBe(-1);
    expect(event.deltaY).toBe(-1);
    expect(event.deltaZ).toBe(-1);
    expect(event.animationName).toBe("");
    expect(event.pseudoElement).toBe("");
    expect(event.elapsedTime).toBe(-1);
    expect(event.propertyName).toBe("");
    expect(event.blah).toBe(undefined);
    expect(event.test).toBe("X");
  });
});
