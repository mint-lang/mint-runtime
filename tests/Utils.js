import Main from "../source/Main.js";

const { compare, update, Record, navigate, insertStyles } = Main;

console.warn = jest.fn();

describe("compare", () => {
  test("compares null and undefined with ===", () => {
    expect(compare(undefined, undefined)).toBe(true);
    expect(compare(null, undefined)).toBe(false);
    expect(compare(undefined, null)).toBe(false);
    expect(compare(null, null)).toBe(true);

    expect(console.warn.mock.calls.length).toBe(4);
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
});

describe("insertStyles", () => {
  test("adds styles to the document", () => {
    insertStyles("test");
    expect(document.head.querySelector("style").textContent).toBe("test");
  });
});
