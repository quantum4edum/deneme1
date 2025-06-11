import { Electron } from './Electron.js';

export class Atom {
  constructor() {
    this.electron = new Electron(1);
  }
}
