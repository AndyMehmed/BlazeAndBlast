// The Ghost class represents a ghost character in a game.
class Ghost {
    constructor(x, y, width, height, color) {

        // Store the initial position, size, and color of the ghost.
        this.position = {
            x: x,
            y: y,
        };
        this.width = width;
        this.height = height;
        this.color = color;

        // Initialize the velocity and speed of the ghost.
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.speed = 0.3;

        // Set the initial state of not following the player.
        this.followingPlayer = false;
    }

    // Draw the ghost on the canvas.
    draw() {

        // Set the color and size of the ghost.
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    // Update the ghost's position based on the player's position.
    update(player) {

        // Calculate the distance between the ghost and the player.
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if the distance is less than or equal to 100, indicating that the ghost should start following the player.
        if (distance <= 100) {
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

        // If the ghost is following the player, update its velocity and position.
        if (this.followingPlayer) {

            // Update the ghost's velocity based on the direction and speed.
            this.velocity.x = (dx / distance) * this.speed;
            this.velocity.y = (dy / distance) * this.speed;

            // Update the ghost's position by adding the velocity.
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }
}

