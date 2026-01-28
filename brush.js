class Brush {
  constructor(x, y, radius, r = 180, g = 80, b = 80, frictionOpts = {}) {
    this.radius = radius;
    this.color = [r, g, b];
    this.prevPos = null;
    this.frictionOpts = frictionOpts;

    let opts = this._frictionForRadius(this.radius);
    let options = {
      restitution: 0.6,
      friction: opts.friction,
      frictionAir: opts.frictionAir,
      frictionStatic: opts.frictionStatic,
    };
    this.body = Bodies.circle(x, y, this.radius, options);
    this.body.brushRef = this;
    Composite.add(engine.world, this.body);
  }

  _frictionForRadius(radius) {
    let f = (this.frictionOpts.friction ?? 0.01) * radius;
    return { friction: f, frictionAir: f, frictionStatic: f };
  }

  respawn(x, y) {
    Matter.Body.setPosition(this.body, { x, y });
    Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(this.body, 0);
  }

  setRandomSize(radiusMin, radiusMax) {
    let pos = this.body.position;
    let vel = this.body.velocity;
    Composite.remove(engine.world, this.body);
    this.radius = radiusMin + random(radiusMax - radiusMin);
    let opts = this._frictionForRadius(this.radius);
    let options = {
      restitution: 0.6,
      friction: opts.friction,
      frictionAir: opts.frictionAir,
      frictionStatic: opts.frictionStatic,
    };
    this.body = Bodies.circle(pos.x, pos.y, this.radius, options);
    Matter.Body.setVelocity(this.body, vel);
    this.body.brushRef = this;
    Composite.add(engine.world, this.body);
  }

  show() {
    let pos = this.body.position;

    push();
    fill(this.color[0], this.color[1], this.color[2]);
    noStroke();
    circle(pos.x, pos.y, this.radius * 2);
    pop();
  }
}
