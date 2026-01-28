class Boundary {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    let options = { isStatic: true, friction: 0.3, frictionStatic: 0.5 };
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
    Composite.add(engine.world, this.body);
  }

  // Drawing the box
  show() {
    rectMode(CENTER);
    fill(127);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}
