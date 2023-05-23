class Projectile {
    constructor(x, y, radius, color,
        velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius,
            0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.
            x
        this.y = this.y + this.velocity.
            y
    }
}



addEventListener('click', function (event) {
    const angle = Math.atan2(
        event.clientY - canvas.height /
        2,
        event.clientX - canvas.width / 2
    )

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    projectiles.push(
        new Projectile(canvas.width / 2,
            canvas.height / 2, 5, 'red', velocity,)
    )
})

animate()


