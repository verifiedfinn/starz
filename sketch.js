let stars = [];
let shootingStars = [];
let slant;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  angleMode(RADIANS);
  slant = PI / 6;
  initStars();
}

function draw() {
  let t = frameCount / 600; // smooth time
  background(0);
  noStroke();

  let baseAngle = TWO_PI * 0.04 * t; // slow rotation

  // Rotate stars with sky tilt
  for (let star of stars) {
    star.opacity = map(sin(TWO_PI * t * star.twinkleSpeed * 4 + star.offset), -1, 1, 0.3, 1);
    fill(star.hue, star.hue, 255, star.opacity * 255);

    let x1 = star.initialX * cos(baseAngle) - star.initialY * sin(baseAngle);
    let y1 = star.initialX * sin(baseAngle) + star.initialY * cos(baseAngle);
    let y2 = y1 * cos(slant);

    circle(x1 + width / 2, y2 + height / 2, star.size);
  }

  // Spawn shooting stars dynamically
  if (frameCount % int(random(60, 180)) === 0) {
    let angle = PI / 4;
    let speed = random(8, 12); // slightly slower
    shootingStars.push({
      x: random(width * 0.4, width * 1.1),
      y: random(-200, -50),
      speedX: -speed * cos(angle),
      speedY: speed * sin(angle),
      length: random(80, 120),
      hue: random(200, 255),
      opacity: 1
    });
  }

  // Update & draw shooting stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i];
    s.x += s.speedX;
    s.y += s.speedY;
    s.opacity -= 0.0015;

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

    if (s.y > height * 1.5 || s.x < -width * 0.2 || s.opacity <= 0) {
      shootingStars.splice(i, 1);
    }
  }
}

function initStars() {
  stars = [];
  let starCount = 1800;
  let maxRadius = dist(0, 0, width / 2, height / 2) * 1.5;

  for (let i = 0; i < starCount; i++) {
    let angle = random(TWO_PI);
    let radius = sqrt(random()) * maxRadius; // uniform circular spread
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    stars.push({
      initialX: x,
      initialY: y,
      size: random(0.5, 2.5),
      opacity: random(0.3, 1),
      twinkleSpeed: random(0.01, 0.07),
      offset: random(TWO_PI),
      hue: random(200, 255)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initStars();
}
