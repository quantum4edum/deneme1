 import { Atom } from "./Atom.js";
import { Electron } from "./Electron.js";
import { Photon } from "./Photon.js";

export class AtomSimulation {
  constructor(canvas, callbacks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.callbacks = callbacks;

    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;

    this.center = { x: this.width / 2, y: this.height / 2 };

    this.levelColors = [ "#a6cee3", "#b2df8a", "#fb9a99", "#fdbf6f" ];
    this.atom = new Atom();
    this.electron = this.atom.electron;

    this.n = this.electron.n;
    this.targetN = this.electron.n;
    this.energy = this.electron.energy();
    this.temperature = 300;

    this.animationTime = 1000; // ms
    this.lastUpdate = null;
    this.electronAngle = 0;
    this.animating = false;
    this.deltaE = null;
    this.lambda = null;
  }

  start() {
    this.resize();
    requestAnimationFrame( time => this.loop(time) );
  }

  resize() {
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.center = { x: this.width / 2, y: this.height / 2 };
  }

  loop(time) {
    if ( !this.lastUpdate ) this.lastUpdate = time;
    const dt = time - this.lastUpdate;
    this.lastUpdate = time;

    // random thermal excitation based on temperature
    if (Math.random() < this.temperature / 1e6) {
      const next = Math.min(4, this.n + 1);
      if (next !== this.n) this.setLevel(next);
    }

    this.update(dt);
    this.draw();
    requestAnimationFrame( t => this.loop(t) );
  }

  energyForLevel(n) {
    return -13.6 / (n * n);
  }

  setTemperature(temp) {
    this.temperature = temp;
  }

  setLevel(n) {
    if (n === this.n) return;
    this.targetN = n;
    this.deltaE = this.energyForLevel(n) - this.energyForLevel(this.n);
    this.photon = new Photon(this.deltaE);
    this.lambda = this.photon.lambda;
    this.animating = true;
    this.animationElapsed = 0;
  }

  update(dt) {
    if (this.animating) {
      this.animationElapsed += dt;
      const progress = Math.min(this.animationElapsed / this.animationTime, 1);
      if (progress >= 1) {
        this.animating = false;
        this.electron.n = this.targetN;
        this.n = this.electron.n;
        this.energy = this.electron.energy();
        this.deltaE = null;
        this.lambda = null;
        this.photon = null;
      }
    }

    this.electronAngle += dt * 0.001; // constant angular velocity
    if (this.electronAngle > Math.PI * 2) this.electronAngle -= Math.PI * 2;

    if (this.callbacks.onUpdate) {
      this.callbacks.onUpdate({
        n: this.n,
        energy: this.energy,
        deltaE: this.deltaE,
        lambda: this.lambda
      });
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // draw nucleus
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // draw orbits
    for (let i = 1; i <= 4; i++) {
      ctx.strokeStyle = this.levelColors[i - 1];
      ctx.beginPath();
      ctx.arc(this.center.x, this.center.y, 40 * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    const progress = this.animating ? Math.min(this.animationElapsed / this.animationTime, 1) : 1;
    // compute electron radius (interpolated during animation)
    const targetRadius = 40 * this.targetN;
    const currentRadius = this.electron.radius();
    const radius = currentRadius + (targetRadius - currentRadius) * progress;

    // draw photon if animating
    if (this.animating) {
      ctx.strokeStyle = this.photon.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.center.x, this.center.y - currentRadius);
      ctx.lineTo(this.center.x, this.center.y - radius);
      ctx.stroke();
    }

    // draw electron
    const angle = this.electronAngle;
    const x = this.center.x + radius * Math.cos(angle);
    const y = this.center.y + radius * Math.sin(angle);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}
