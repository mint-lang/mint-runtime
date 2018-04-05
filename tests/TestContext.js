import Main from "../source/Main.js";

const { TestContext } = Main;

describe("teardown", () => {
  test("it is called after success", async () => {
    const teardown = jest.fn();
    const context = new TestContext("A", teardown);
    context.step(subject => {
      return subject == "A";
    });

    const result = await context.run();

    expect(result).toBe(true);
    expect(teardown.mock.calls.length).toBe(1);
  });

  test("it is called after failure", async () => {
    const teardown = jest.fn();
    const context = new TestContext("A", teardown);
    context.step(subject => {
      return subject == "A";
    });
    context.step(subject => {
      throw "WTF";
    });

    let result

    try {
      await context.run();
    } catch (error) {
      result = error
    }

    expect(result).toBe("WTF");
    expect(teardown.mock.calls.length).toBe(1);
  });
});
