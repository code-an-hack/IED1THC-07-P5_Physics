const { Engine, Bodies, Body, Composite, Constraint, Vector, Mouse, MouseConstraint } = Matter;

let engine;

let boundaries = [];

let brushes = [];
const BRUSH_COUNT = 3;
const RADIUS_MIN = 20;
const RADIUS_MAX = 35;
const FRICTION_MIN = 0.4;
const FRICTION_MAX = 0.8;
const FRICTION_AIR_MIN = 0.02;
const FRICTION_AIR_MAX = 0.07;
const FRICTION_STATIC_MIN = 0.25;
const FRICTION_STATIC_MAX = 0.7;

let mouse, mouseConstraint;

let motion = false;
let ios = false;

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
} else {
  // we are not on ios13 and above
  // todo
  // add detection for hardware for other devices
  // if(got the hardware) {
  // motion = true;
  // }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  // Create the Matter engine
  engine = Engine.create();
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0;

  // Add a bunch of fixed boundaries (inset and wall thickness)
  const inset = 12;
  const wallThick = 24;
  boundaries.push(new Boundary(width / 2, height - inset, width, wallThick));
  boundaries.push(new Boundary(width / 2, inset, width, wallThick));
  boundaries.push(new Boundary(inset, height / 2, wallThick, height));
  boundaries.push(new Boundary(width - inset, height / 2, wallThick, height));

  const cx = width / 2;
  const cy = height / 2;
  const spread = Math.min(width, height) * 0.2;
  const hues = [0, 60, 120, 200, 280]; // spread around color wheel
  for (let i = 0; i < BRUSH_COUNT; i++) {
    let radius = RADIUS_MIN + random(RADIUS_MAX - RADIUS_MIN);
    let friction = random(FRICTION_MIN, FRICTION_MAX);
    let frictionAir = random(FRICTION_AIR_MIN, FRICTION_AIR_MAX);
    let frictionStatic = random(FRICTION_STATIC_MIN, FRICTION_STATIC_MAX);
    let x = cx + random(-spread, spread);
    let y = cy + random(-spread, spread);
    let h = hues[i];
    let [r, g, b] = hslToRgb(h / 360, 0.7, 0.55);
    brushes.push(
      new Brush(x, y, radius, r, g, b, {
        friction,
        frictionAir,
        frictionStatic,
      }),
    );
  }

  mouse = Mouse.create(canvas.elt);
  let options = {
    mouse: mouse,
    constraint: {
      stiffness: 0.7,
    },
  };
  mouseConstraint = MouseConstraint.create(engine, options);
  Composite.add(engine.world, mouseConstraint);
}

function draw() {
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

  // Display all the boundaries
  for (let i = 0; i < boundaries.length; i++) {
    boundaries[i].show();
  }

  for (let i = 0; i < brushes.length; i++) {
    brushes[i].show();
  }
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
