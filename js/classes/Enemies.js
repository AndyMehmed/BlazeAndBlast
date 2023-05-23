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
    
        if (distance <= 200) {
            this.followingPlayer = true;
            
        }

        if (
            player.position.x < this.position.x + this.width &&
            player.position.x + player.width > this.position.x &&
            player.position.y + player.height > this.position.y &&
            player.position.y < this.position.y + this.height
        ) {
            player.health -= 1;  // Player takes damage when colliding with an enemy
        }
        
    
        if (this.followingPlayer) {
            let newVelocityX = (dx / distance) * this.speed;
            let newVelocityY = (dy / distance) * this.speed;
    
            // First, handle movement and collision in the x-direction
            this.velocity.x = newVelocityX;
            this.position.x += this.velocity.x;
            for (let i = 0; i < collisionBlocks.length; i++) {
                const collisionBlock = collisionBlocks[i];
                if (
                    this.position.x < collisionBlock.position.x + collisionBlock.width &&
                    this.position.x + this.width > collisionBlock.position.x &&
                    this.position.y + this.height > collisionBlock.position.y &&
                    this.position.y < collisionBlock.position.y + collisionBlock.height
                ) {
                    if (this.velocity.x < 0) {
                        this.position.x = collisionBlock.position.x + collisionBlock.width + 0.01;
                        this.velocity.x = 0;  // Reset velocity
                        break;
                    }
                    if (this.velocity.x > 0) {
                        this.position.x = collisionBlock.position.x - this.width - 0.01;
                        this.velocity.x = 0;  // Reset velocity
                        break;
                    }
                }
            }
    
            // Then, handle movement and collision in the y-direction
            this.velocity.y = newVelocityY;
            this.position.y += this.velocity.y;
            for (let i = 0; i < collisionBlocks.length; i++) {
                const collisionBlock = collisionBlocks[i];
                if (
                    this.position.x < collisionBlock.position.x + collisionBlock.width &&
                    this.position.x + this.width > collisionBlock.position.x &&
                    this.position.y + this.height > collisionBlock.position.y &&
                    this.position.y < collisionBlock.position.y + collisionBlock.height
                ) {
                    if (this.velocity.y < 0) {
                        this.position.y = collisionBlock.position.y + collisionBlock.height + 0.01;
                        this.velocity.y = 0;  // Reset velocity
                        break;
                    }
                    if (this.velocity.y > 0) {
                        this.position.y = collisionBlock.position.y - this.height - 0.01;
                        this.velocity.y = 0;  // Reset velocity
                        break;
                    }
                }
            }
        }
    }
}