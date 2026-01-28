const { Engine, Bodies, Body, Composite, Vector, Events } = Matter;

let engine;
let boundaries = [];
let brushes = [];

const BRUSH_COUNT = 60;
const RADIUS_MIN = 5;
const RADIUS_MAX = 60;
const FRICTION = 0.01;

const inset = 12;
const wallThick = 24;

let pendingResizes = [];
let boundsMargin = 0;
let motion = false;
let ios = false;

const BRUSH_COLORS = [
  [66, 135, 245],
  [138, 198, 255],
  [109, 70, 194],
  [119, 218, 242],
  [4, 18, 92],
];

if (typeof DeviceMotionEvent.requestPermission === "function") {
  document.body.addEventListener("click", function () {
    DeviceMotionEvent.requestPermission()
      .then(function () {
        console.log("DeviceMotionEvent enabled");

        motion = true;
        ios = true;
      })
      .catch(function (error) {
        console.warn("DeviceMotionEvent not enabled", error);
      });
  });
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  // Create the Matter engine
  engine = Engine.create();
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0;

  // Collision listener must be registered before adding bodies
  Events.on(engine, "collisionStart", function (event) {
    for (let i = 0; i < event.pairs.length; i++) {
      let A = event.pairs[i].bodyA;
      let B = event.pairs[i].bodyB;
      if (A.brushRef && B.brushRef) {
        pendingResizes.push([A.brushRef, B.brushRef]);
      }
    }
  });

  // Add a bunch of fixed boundaries (inset and wall thickness)

  boundsMargin = inset + wallThick / 2;
  boundaries.push(new Boundary(width / 2, height - inset, width, wallThick));
  boundaries.push(new Boundary(width / 2, inset, width, wallThick));
  boundaries.push(new Boundary(inset, height / 2, wallThick, height));
  boundaries.push(new Boundary(width - inset, height / 2, wallThick, height));

  for (let i = 0; i < BRUSH_COUNT; i++) {
    let radius = RADIUS_MIN + random(RADIUS_MAX - RADIUS_MIN);
    let x = width / 2 + random(-width / 2, width / 2);
    let y = height / 2 + random(-height / 2, height / 2);
    let [r, g, b] = BRUSH_COLORS[i % BRUSH_COLORS.length];
    brushes.push(new Brush(x, y, radius, r, g, b, { friction: FRICTION }));
  }
}

function draw() {
  // Apply deferred brush resizes from collisions (avoids mutating world during collision)
  while (pendingResizes.length > 0) {
    let [brushA, brushB] = pendingResizes.shift();
    brushA.setRandomSize(RADIUS_MIN, RADIUS_MAX);
    brushB.setRandomSize(RADIUS_MIN, RADIUS_MAX);
  }

  //   background(255, 255, 255, 5);
  // Device tilt → force on brushes (rotationY = left/right, rotationX = forward/back)
  let forceScale = 0.0004;
  let fx = (rotationY || 0) * forceScale;
  let fy = (rotationX || 0) * forceScale;
  let force = Vector.create(fx, fy);

  for (let i = 0; i < brushes.length; i++) {
    Body.applyForce(brushes[i].body, brushes[i].body.position, force);
  }

  // Update the engine!
  Engine.update(engine);

  // Respawn brushes that went out of bounds
  for (let i = 0; i < brushes.length; i++) {
    let pos = brushes[i].body.position;
    if (pos.x < boundsMargin || pos.x > width - boundsMargin || pos.y < boundsMargin || pos.y > height - boundsMargin) {
      brushes[i].respawn(width / 2, height / 2);
    }
  }

  // Display all the boundaries
  for (let i = 0; i < boundaries.length; i++) {
    boundaries[i].show();
  }

  for (let i = 0; i < brushes.length; i++) {
    brushes[i].show();
  }
}
