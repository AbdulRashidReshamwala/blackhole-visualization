const c = 30;
const G = 2;
const dt = 0.1;

let m87;

const particles = [];
let start, end;

class Blackhole {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.mass = m;
    this.rs = (2 * G * this.mass) / (c * c);
  }

  pull(photon) {
    const force = p5.Vector.sub(this.pos, photon.pos);
    const r = force.mag();
    const fg = (G * this.mass) / (r * r);
    force.setMag(fg);
    photon.vel.add(force);
    photon.vel.setMag(c);

    if (r < this.rs) {
      photon.stop();
    }
  }

  show() {
    ellipseMode(RADIUS);
    fill(0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.rs);

    noFill();
    stroke(255, 85, 0, 150);
    strokeWeight(64);
    ellipse(this.pos.x, this.pos.y, this.rs * 3 + 32);

    stroke(255, 150, 0, 100);
    strokeWeight(32);

    ellipse(this.pos.x, this.pos.y, this.rs * 1.5 + 16);
  }
}

class Photon {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(-c, 0);
    this.history = [];
    this.stopped = false;
    this.theta = 0;
  }

  stop() {
    this.stopped = true;
  }

  update() {
    if (!this.stopped) {
      this.history.push(this.pos.copy());
      const deltaV = this.vel.copy();
      deltaV.mult(dt);
      this.pos.add(deltaV);
    }

    if (this.history.length > 500) {
      this.history.splice(0, 1);
    }
  }

  show() {
    strokeWeight(4);
    stroke(255, 255, 255);
    point(this.pos.x, this.pos.y);

    strokeWeight(2);
    noFill();
    beginShape();
    for (let v of this.history) {
      vertex(v.x, v.y);
    }

    endShape();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  m87 = new Blackhole(width / 2, height / 2, 10000);

  start = height / 2;
  end = height / 2 - m87.rs * 2.6;

  for (let y = 0; y < start; y += 10) {
    particles.push(new Photon(width - 20, y));
  }
}

function draw() {
  background(70);

  stroke(0);
  strokeWeight(1);

  for (let p of particles) {
    m87.pull(p);
    p.update();
    p.show();
  }
  m87.show();
}
