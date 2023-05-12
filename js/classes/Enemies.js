class Enemy {
    constructor(x, y, width, height, color) {
        this.position = {
            x: x,
            y: y,
        };
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.speed = 0.3;
        this.followingPlayer = false;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

update(player) {
    const dx = player.position.x - this.position.x;
    const dy = player.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only move towards the player if the distance is less than or equal to 200
    if (distance <= 200) {
        this.followingPlayer = true;
    }

    if (this.followingPlayer) {
        this.velocity.x = (dx / distance) * this.speed;
        this.velocity.y = (dy / distance) * this.speed;
        // Check for collisions with the collision blocks
        for (let i = 0; i < collisionBlocks.length; i++) {
            const collisionBlock = collisionBlocks[i];

            // If a collision exists
            if (
                this.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.position.x + this.width >= collisionBlock.position.x &&
                this.position.y + this.height >= collisionBlock.position.y &&
                this.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                // Collision on x-axis going to the left
                if (this.velocity.x < 0) {
                    const offset = this.position.x - collisionBlock.position.x;
                    this.position.x = collisionBlock.position.x + collisionBlock.width + offset + 0.01;
                    this.velocity.x = 0;  // Reset velocity
                    break;
                }

                // Collision on x-axis going to the right
                if (this.velocity.x > 0) {
                    const offset = this.position.x + this.width - collisionBlock.position.x;
                    this.position.x = collisionBlock.position.x - this.width - offset - 0.01;
                    this.velocity.x = 0;  // Reset velocity
                    break;
                }

                // Collision on y-axis going upwards
                if (this.velocity.y < 0) {
                    const offset = this.position.y - collisionBlock.position.y;
                    this.position.y = collisionBlock.position.y + collisionBlock.height + offset + 0.01;
                    this.velocity.y = 0;  // Reset velocity
                    break;
                }

                // Collision on y-axis going downwards
                if (this.velocity.y > 0) {
                    const offset = this.position.y + this.height - collisionBlock.position.y;
                    this.position.y = collisionBlock.position.y - this.height - offset - 0.01;
                    this.velocity.y = 0;  // Reset velocity
                    break;
                }
            }
        }

        // Move the enemy
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
}