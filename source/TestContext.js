export default class TextContext {
  constructor(subject, teardown) {
    this.teardown = teardown || (() => {});
    this.subject = subject;
    this.error = null;
    this.steps = [];
  }

  async run() {
    return new Promise((resolve, reject) => {
      this.next(resolve, reject);
    }).then(() => this.teardown());
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
