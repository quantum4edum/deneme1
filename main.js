import { AtomSimulation } from './simulation/AtomSimulation.js';

const canvas = document.getElementById('simCanvas');
const nSelect = document.getElementById('nSelect');
const tempSlider = document.getElementById('tempSlider');
const tempValue = document.getElementById('tempValue');
const levelInfo = document.getElementById('levelInfo');
const energyInfo = document.getElementById('energyInfo');
const deltaEInfo = document.getElementById('deltaEInfo');
const lambdaInfo = document.getElementById('lambdaInfo');

const sim = new AtomSimulation(canvas, {
  onUpdate(info) {
    levelInfo.textContent = info.n;
    energyInfo.textContent = info.energy.toFixed(2) + ' eV';
    deltaEInfo.textContent = info.deltaE ? info.deltaE.toFixed(2) + ' eV' : '-';
    lambdaInfo.textContent = info.lambda ? info.lambda.toFixed(0) + ' nm' : '-';
  }
});

nSelect.addEventListener('change', () => {
  const n = parseInt(nSelect.value, 10);
  sim.setLevel(n);
});

tempSlider.addEventListener('input', () => {
  tempValue.textContent = tempSlider.value + 'K';
  sim.setTemperature(parseInt(tempSlider.value, 10));
});

window.addEventListener('resize', () => sim.resize());

tempValue.textContent = tempSlider.value + 'K';
sim.start();
