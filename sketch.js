let stars = [];
let shootingStars = [];
let slant;
let fadeAlpha = 255;
let starCount = 1800;

function setup() {
  pixelDensity(1); // Avoid scaling issues on mobile
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  angleMode(RADIANS);
  colorMode(RGB, 255, 255, 255, 255);
  slant = PI / 6;
  initStars();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initStars();
}

function draw() {
  background(0);
  let t = frameCount / 600;
  let baseAngle = TWO_PI * 0.04 * t;

  noStroke();

  // Twinkling stars
  for (let star of stars) {
    // Random sharp twinkle flicker
    if (random() < 0.01) {
      star.opacity = random(0.1, 1);
    }
    fill(star.hue, star.hue, 255, star.opacity * 255);

    // Rotate star position
    let x1 = star.initialX * cos(baseAngle) - star.initialY * sin(baseAngle);
    let y1 = star.initialX * sin(baseAngle) + star.initialY * cos(baseAngle);
    let y2 = y1 * cos(slant);

    circle(x1 + width / 2, y2 + height / 2, star.size);
  }

  // Occasionally spawn shooting stars from top right
  if (frameCount % int(random(90, 180)) === 0) {
    let angle = PI / 4; // Down-left diagonal
    let speed = random(8, 12);
    shootingStars.push({
      x: random(width * 0.8, width + 100),
      y: random(-100, -20),
      speedX: -speed * cos(angle),
      speedY: speed * sin(angle),
      length: random(80, 120),
      hue: random(200, 255),
      opacity: 1
    });
  }

  // Draw and update shooting stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i];
    s.x += s.speedX;
    s.y += s.speedY;
    s.opacity -= 0.002;

    for (let j = 0; j < s.length; j++) {
      let alpha = s.opacity * (1 - j / s.length) ** 2;
      stroke(s.hue, s.hue, 255, alpha * 255);
      strokeWeight(1.5 - 1.25 * (j / s.length));
      let offsetX = s.speedX * j / 6;
      let offsetY = s.speedY * j / 6;
      line(
        s.x - offsetX,
        s.y - offsetY,
        s.x - offsetX - s.speedX,
        s.y - offsetY - s.speedY
      );
    }

    noStroke();
    fill(s.hue, s.hue, 255, s.opacity * 255);
    circle(s.x, s.y, 3);

    if (
      s.y > height + 100 ||
      s.x < -100 ||
      s.opacity <= 0
    ) {
      shootingStars.splice(i, 1);
    }
  }

  // Fade-in on load
  if (fadeAlpha > 0) {
    fill(0, fadeAlpha);
    rect(0, 0, width, height);
    fadeAlpha -= 3;
    fadeAlpha = max(fadeAlpha, 0);
  }
}

function initStars() {
  stars = [];
  let maxRadius = dist(0, 0, width / 2, height / 2) * 1.5;

  for (let i = 0; i < starCount; i++) {
    let angle = random(TWO_PI);
    let radius = sqrt(random()) * maxRadius;
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    stars.push({
      initialX: x,
      initialY: y,
      size: random(0.5, 2.5),
      opacity: random(0.2, 1),
      hue: random(200, 255)
    });
  }
}








