**Demo**
https://code-an-hack.github.io/IED1THC-07-P5_Physics/

**Device permissions**

Use https and this:

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

**Steps**
1. Create a brush.js file with a Brush class. The constructor takes x and y position, radius and RGB color values. On mobile, each time the screen is touched spawn a new brush somewhere random in the canvas.
3. Use matter.js. Add brushes to the physics world. The brushes should now use perlin noise to move in the canvas. When they collide they change color.
4. Device tilt (rotationY, rotationX) should now control the movement of the brushes. Convert device tilt angles into force vectors and apply them to all brushes. The tilt amount determines the force magnitude and direction. Clamp the position of the brushes so that they will not go out of the bounds of the mobile phone screen.
5. Randomize the size of the brushes. Add size based friction to the brushes.
