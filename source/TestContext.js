export default class TestContext {
  constructor(subject, teardown) {
    this.teardown = teardown;
    this.subject = subject;
    this.error = null;
    this.steps = [];
  }

  async run() {
    let result;
    try {
      result = await new Promise(this.next.bind(this));
    } catch (error) {
      result = error;
    } finally {
      this.teardown && this.teardown();
    }

    return result;
  }

  async next(resolve, reject) {
    requestAnimationFrame(async () => {
      let step = this.steps.shift();

      try {
        this.subject = await step(this.subject);
      } catch (error) {
        this.error = error;
        reject(this.error.toString());
      }
      if (this.steps.length) {
        this.next(resolve, reject);
      } else {
        resolve(this.subject);
      }
    });
  }

  step(proc) {
    this.steps.push(proc);
    return this;
  }
}
