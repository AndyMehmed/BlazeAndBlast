class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.enemyHit = null; // Track the enemy being hit
    this.active = true; // Flag to indicate if the projectile is active
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
    if (!this.active) return; // Skip update if projectile is not active
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

addEventListener('click', (event) => {
  if (projectiles.length === 0) {
    const angle = Math.atan2(
      event.clientY - canvas.height / 1.75,
      event.clientX - canvas.width / 1.9
    );

    const velocity = {
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2
    };

    projectiles.push(
      new Projectile(
        player.position.x + 12.5,
        player.position.y + 17.5,
        2,
        'red',
        velocity
      )
    );
  }
});
