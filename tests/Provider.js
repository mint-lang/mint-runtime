import Main from "./Main.js";

const { Provider } = Main;

describe("subscribing", () => {
  test("calls attach", () => {
    const provider = new Provider();
    provider.attach = jest.fn();
    provider._subscribe("A");

    expect(provider._subscriptions.length).toBe(1);
    expect(provider.attach.mock.calls.length).toBe(1);

    provider._unsubscribe("A");
  });

  test("does not call _update many times", () => {
    const provider = new Provider();
    provider._update = jest.fn();
    provider._subscribe("A");
    provider._subscribe("A");

    expect(provider._update.mock.calls.length).toBe(1);
  });
});

describe("unsubscribing", () => {
  test("calls detach", () => {
    const provider = new Provider();
    provider.detach = jest.fn();
    provider._subscribe("A");
    provider._unsubscribe("A");

    expect(provider._subscriptions.length).toBe(0);
    expect(provider.detach.mock.calls.length).toBe(1);
  });

  test("does nothing if not subscribed", () => {
    const provider = new Provider();
    provider.detach = jest.fn();
    provider._unsubscribe("A");

    expect(provider._subscriptions.length).toBe(0);
    expect(provider.detach.mock.calls.length).toBe(0);
  });
});
