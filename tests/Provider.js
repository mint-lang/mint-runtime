import Main from "./Main.js";

const { Provider } = Main;

class TestProvider extends Provider {
  constructor() {
    super();
    this._d({
      TEST: () => +new Date(),
    });
  }
}

describe("subscribing", () => {
  test("cover update", () => {
    const provider = new TestProvider();
    provider.update();
  });

  test("cover setState", () => {
    const provider = new TestProvider();
    provider.setState({ name: "value" }, () => {});

    expect(provider.state.name).toBe("value");
  });

  test("calls update", () => {
    const provider = new TestProvider();
    provider.update = jest.fn();
    provider._subscribe("A", { data: "data" });

    expect(provider._subscriptions.length).toBe(1);
    expect(provider.update.mock.calls.length).toBe(1);

    provider._unsubscribe("A");
  });

  test("does not call _update many times", () => {
    const provider = new TestProvider();
    provider._update = jest.fn();
    provider._subscribe("A", { data: "data" });
    provider._subscribe("A", { data: "data" });

    expect(provider._update.mock.calls.length).toBe(1);
  });

  test("does not call _update without any data", () => {
    const provider = new TestProvider();
    provider._update = jest.fn();
    provider._subscribe("A");

    expect(provider._update.mock.calls.length).toBe(0);
  });
});

describe("unsubscribing", () => {
  test("calls update", () => {
    const provider = new TestProvider();
    provider.update = jest.fn();
    provider._subscribe("A", { data: "data" });
    provider._unsubscribe("A");

    expect(provider._subscriptions.length).toBe(0);
    expect(provider.update.mock.calls.length).toBe(2);
  });

  test("does nothing if not subscribed", () => {
    const provider = new TestProvider();
    provider.update = jest.fn();
    provider._unsubscribe("A");

    expect(provider._subscriptions.length).toBe(0);
    expect(provider.update.mock.calls.length).toBe(0);
  });
});
