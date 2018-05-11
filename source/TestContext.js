export default class TestContext {
  constructor(subject, teardown) {
    this.teardown = teardown;
    this.subject = subject;
    this.steps = [];
  }

  async run() {
    let result;

    try {
      result = await new Promise(this.next.bind(this));
    } finally {
      this.teardown && this.teardown();
    }

    return result;
  }

  async next(resolve, reject) {
    requestAnimationFrame(async () => {
      let step = this.steps.shift();

      if (step) {
        try {
          this.subject = await step(this.subject);
        } catch (error) {
          return reject(error);
        }
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
