class Brush {
  constructor(x, y, radius, r = 180, g = 80, b = 80, frictionOpts = {}) {
    this.radius = radius;
    this.color = [r, g, b];
    this.prevPos = null;

    let options = {
      restitution: 0.6,
      friction: frictionOpts.friction ?? 0.3,
      frictionAir: frictionOpts.frictionAir ?? 0.02,
      frictionStatic: frictionOpts.frictionStatic ?? 0.5,
    };
    this.body = Bodies.circle(x, y, this.radius, options);
    Composite.add(engine.world, this.body);
  }

  show() {
    let pos = this.body.position;

    // Draw one segment from previous position to current (accumulates on canvas)
    if (this.prevPos !== null) {
      push();
      noFill();
      stroke(this.color[0], this.color[1], this.color[2]);
      strokeWeight(this.radius * 1.2);
      strokeCap(ROUND);
      line(this.prevPos.x, this.prevPos.y, pos.x, pos.y);
      pop();
    }
    this.prevPos = { x: pos.x, y: pos.y };

    // Draw the circle (brush head)
    push();
    fill(this.color[0], this.color[1], this.color[2]);
    noStroke();
    circle(pos.x, pos.y, this.radius * 2);
    pop();
  }
}
