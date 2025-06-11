export class Photon {
  constructor(deltaE) {
    this.deltaE = deltaE;
    const hc = 1240; // eV*nm
    this.lambda = Math.abs(hc / deltaE);
    this.color = deltaE > 0 ? 'red' : 'blue';
  }
}
