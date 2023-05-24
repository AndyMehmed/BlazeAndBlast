class HealthBar {
    constructor(player, maxHealth) {
        this.player = player;
        this.maxHealth = maxHealth;
        this.width = 200;
        this.height = 20;
        this.x = 10;
        this.y = 10;
    }

    draw() {
        // Draw the outline of the health bar
        c.strokeStyle = 'black';
        c.strokeRect(this.x, this.y, this.width, this.height);
        
        // Calculate the width of the health bar
        const healthBarWidth = (this.player.health / this.maxHealth) * this.width;

        // Draw the health bar
        c.fillStyle = 'red';
        c.fillRect(this.x, this.y, healthBarWidth, this.height);
    }
}