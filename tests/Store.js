import Main from "../source/Main.js";

const { Store } = Main;

class TestStore extends Store {
  constructor() {
    super();
    this.state = { name: "Joe" };
  }

  get name() {
    return this.state.name;
  }
}

const store = new TestStore();

const listener = {
  forceUpdate: jest.fn()
};

const callback = jest.fn();

describe("state", () => {
  test("returns default state", () => {
    expect(store.state.name).toBe("Joe");
  });
});

describe("updating state", () => {
  test("calls any listeners", () => {
    store._subscribe(listener);
    store.setState({ name: "Test" }, callback);
    store._unsubscribe(listener);
    expect(store.state.name).toBe("Test");
    expect(callback.mock.calls.length).toBe(1);
    expect(listener.forceUpdate.mock.calls.length).toBe(1);
  });
});
