export class Electron {
  constructor(n = 1) {
    this.n = n;
  }

  radius() {
    return 40 * this.n;
  }

  energy() {
    return -13.6 / (this.n * this.n);
  }
}
