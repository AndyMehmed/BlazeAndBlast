class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// Event listener for the "click" event
addEventListener('click', function (event) {
    // Calculate the angle between the center of the canvas and the clicked position
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    );

    // Calculate the velocity vector based on the angle
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };

    // Create a new Projectile object with the initial position at the center of the canvas,
    // a radius of 5, color red, and the calculated velocity vector
    projectiles.push(
        new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', velocity)
    );
});

// Animation function (assumed to be defined elsewhere)
function animate() {
    // Clear the canvas

    // Update and render each projectile in the "projectiles" array

    // Call the "animate()" function again for the next frame
}

// Call the "animate()" function to start the animation loop
animate();


