export default class Queue {
  promises: Array<{ promise: Promise<void>; resolve: Function }> = [];

  get remaining(): number {
    return this.promises.length;
  }

  async wait(): Promise<void> {
    const next = this.promises.length
      ? this.promises[this.promises.length - 1].promise
      : Promise.resolve();
    let resolve: Function = () => {};
    const promise: Promise<void> = new Promise(res => {
      resolve = res;
    });

    this.promises.push({
      resolve,
      promise
    });

    return next;
  }

  shift(): void {
    const deferred = this.promises.shift();
    if (typeof deferred !== "undefined") deferred.resolve();
  }
}
