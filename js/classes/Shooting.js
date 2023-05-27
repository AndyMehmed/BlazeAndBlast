class Projectile {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
      this.enemyHit = null; // Track the enemy being hit
    }
  
    checkCollision(enemy) {
      if (
        this.x < enemy.position.x + enemy.width &&
        this.x + this.radius > enemy.position.x &&
        this.y + this.radius > enemy.position.y &&
        this.y < enemy.position.y + enemy.height
      ) {
        // Projectile has hit the enemy
        this.enemyHit = enemy; // Store the enemy being hit
        return true;
      }
      return false;
    }
      
    
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

addEventListener('click', (event) => {
  console.log('Player position:', player.position.x, player.position.y);
  console.log('Mouse coordinates:', event.clientX, event.clientY);

  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(angle) * 2,
    y: Math.sin(angle) * 2
  };

  projectiles.push(
    new Projectile(
      player.position.x,
      player.position.y,
      2,
      'red',
      velocity
    )
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

