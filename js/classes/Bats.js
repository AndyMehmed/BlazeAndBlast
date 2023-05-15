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
        if (distance <= 100) {
            this.followingPlayer = true;
        }
        if (this.followingPlayer) {
            this.velocity.x = (dx / distance) * this.speed;
            this.velocity.y = (dy / distance) * this.speed;
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }
}