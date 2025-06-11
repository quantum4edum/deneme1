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

function drawArrow(fromX, fromY, toX, toY, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  const headLen = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6),
              toY - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6),
              toY - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawSimulation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerY = canvas.height / 2;

  // Başlangıç fotonu oku ve foton
  drawArrow(50, centerY, 300, centerY, 'blue');
  ctx.beginPath();
  ctx.arc(50, centerY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = 'blue';
  ctx.fill();

  // Elektron
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(300, centerY, 10, 0, 2 * Math.PI);
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
  const startY = centerY;
  const endX = startX + length * Math.cos(rad);
  const endY = startY - length * Math.sin(rad);

  drawArrow(startX, startY, endX, endY, 'green');
  ctx.beginPath();
  ctx.arc(endX, endY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = 'green';
  ctx.fill();

  // Saçılan elektron (basitleştirilmiş yön)
  drawArrow(startX, startY, startX - length * 0.4, startY + length * Math.sin(rad) * 0.4, 'orange');
}

angleInput.addEventListener('input', drawSimulation);
lambdaInput.addEventListener('input', drawSimulation);
window.addEventListener('load', drawSimulation);
