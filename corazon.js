const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let width = window.innerWidth;
let height = window.innerHeight;
let pixelRatio = 1;
let particles = [];
let backgroundGradient;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  backgroundGradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) * 0.75
  );
  backgroundGradient.addColorStop(0, "#321022");
  backgroundGradient.addColorStop(0.55, "#1b0c1c");
  backgroundGradient.addColorStop(1, "#0b0912");

  particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.5,
    speed: Math.random() * 0.35 + 0.12,
    phase: Math.random() * Math.PI * 2
  }));
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Vector {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  add(v) { return new Vector(this.x + v.x, this.y + v.y); }
  scale(s) { return new Vector(this.x * s, this.y * s); }
}
let time = 0;

function polar(rad, scale) {
  let x = 16 * Math.sin(rad)**3;
  let y = -(13 * Math.cos(rad)-5*Math.cos(2*rad)-2*Math.cos(3*rad)-Math.cos(4*rad));
  return new Vector(x * scale, y * scale);
}

function drawHeart(origin, scale, strokeStyle, lineWidth, glow, fillStyle = null) {
  ctx.beginPath();
  for (let rad = 0; rad <= Math.PI * 2 + 0.04; rad += 0.04) {
    const point = polar(rad, scale);
    const x = origin.x + point.x;
    const y = origin.y + point.y;
    if (rad === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 22;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawText() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const titleSize = Math.max(11, Math.min(15, width * 0.012));
  ctx.font = `500 ${titleSize}px "Segoe UI", sans-serif`;
  ctx.fillStyle = "#ffc5d4";
  ctx.shadowColor = "#ff4777";
  ctx.shadowBlur = 18;
  ctx.fillText("✦  H E C H O   C O N   A M O R  ✦", width / 2, height * 0.08);

  const messageSize = Math.max(14, Math.min(19, width * 0.016));
  ctx.font = `400 ${messageSize}px "Segoe UI", sans-serif`;
  ctx.fillStyle = "#f7cbd6";
  ctx.shadowColor = "#ff4777";
  ctx.shadowBlur = 16;
  ctx.fillText("Te amo Mia", width / 2, height * 0.92);
  ctx.restore();
}

function dibujar() {
  ctx.fillStyle = backgroundGradient;
  ctx.fillRect(0, 0, width, height);

  for (const particle of particles) {
    particle.y -= particle.speed;
    if (particle.y < -4) particle.y = height + 4;
    const twinkle = 0.3 + (Math.sin(time * 0.04 + particle.phase) + 1) * 0.3;
    ctx.beginPath();
    ctx.arc(
      particle.x + Math.sin(time * 0.01 + particle.phase) * 8,
      particle.y,
      particle.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = `rgba(255, 190, 215, ${twinkle})`;
    ctx.fill();
  }

  const origin = new Vector(width / 2, height / 2);
  const baseScale = Math.min(width, height) * 0.009;
  const pulse = 0.25 + ((Math.sin(time * 0.045) + 1) / 2) * 1.1;
  const heartScale = baseScale * pulse;

  for (let i = 0; i < 8; i++) {
    const angle = time * 0.008 + i * Math.PI / 4;
    const x = origin.x + Math.cos(angle) * baseScale * 22;
    const y = origin.y + Math.sin(angle) * baseScale * 22;
    ctx.beginPath();
    ctx.arc(x, y, i % 2 === 0 ? 2.2 : 1.4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd5e2";
    ctx.shadowColor = "#ff4e86";
    ctx.shadowBlur = 14;
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  const gradient = ctx.createLinearGradient(
    origin.x - baseScale * 18,
    origin.y - baseScale * 16,
    origin.x + baseScale * 18,
    origin.y + baseScale * 16
  );
  gradient.addColorStop(0, "#ffb4d0");
  gradient.addColorStop(0.48, "#ff477e");
  gradient.addColorStop(1, "#ff174f");

  const heartFill = ctx.createRadialGradient(
    origin.x, origin.y - baseScale * 5, baseScale,
    origin.x, origin.y, baseScale * 19
  );
  heartFill.addColorStop(0, "rgba(255, 101, 154, 0.25)");
  heartFill.addColorStop(1, "rgba(255, 35, 95, 0.04)");

  drawHeart(origin, heartScale, gradient, 3, "#ff3377", heartFill);
  drawHeart(origin, heartScale * 0.78, "rgba(255, 220, 232, 0.55)", 1, "#ff8eae");
  drawText();

  time += 1;
  requestAnimationFrame(dibujar);
}
dibujar();