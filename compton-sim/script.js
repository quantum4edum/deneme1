const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const angleInput = document.getElementById('angle');
const lambdaInput = document.getElementById('lambda');
const angleValue = document.getElementById('angleValue');
const lambdaValue = document.getElementById('lambdaValue');
const resultSpan = document.getElementById('result');

// Compton sabiti (nm)
const LAMBDA_C = 0.00243; // 2.43e-12 m = 0.00243 nm

function computeScatteredLambda(lambda0, angle) {
  const radians = angle * Math.PI / 180;
  return lambda0 + LAMBDA_C * (1 - Math.cos(radians));
}

function drawSimulation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Başlangıç fotonu
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(50, canvas.height / 2);
  ctx.lineTo(250, canvas.height / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(250, canvas.height / 2, 5, 0, 2 * Math.PI);
  ctx.fillStyle = 'blue';
  ctx.fill();

  // Elektron
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(300, canvas.height / 2, 10, 0, 2 * Math.PI);
  ctx.fill();

  const angle = parseFloat(angleInput.value);
  const finalLambda = computeScatteredLambda(parseFloat(lambdaInput.value), angle);
  resultSpan.textContent = finalLambda.toFixed(3);

  angleValue.textContent = angle;
  lambdaValue.textContent = lambdaInput.value;

  // Saçılan foton
  const length = 150;
  const rad = angle * Math.PI / 180;
  const startX = 300;
  const startY = canvas.height / 2;
  const endX = startX + length * Math.cos(rad);
  const endY = startY - length * Math.sin(rad);

  ctx.strokeStyle = 'green';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(endX, endY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = 'green';
  ctx.fill();

  // Saçılan elektron (basitleştirilmiş yön)
  ctx.strokeStyle = 'orange';
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX - length * 0.4, startY + length * Math.sin(rad) * 0.4);
  ctx.stroke();
}

angleInput.addEventListener('input', drawSimulation);
lambdaInput.addEventListener('input', drawSimulation);
window.addEventListener('load', drawSimulation);
