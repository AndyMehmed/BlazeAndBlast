Array.prototype.parse2D = function() {
    const rows =  []
    for (let i = 0; i < this.length; i+=70) {
        rows.push(this.slice(i, i + 70))
    }

    return rows
}

Array.prototype.createObjectsFrom2D = function () {
    const objects = []
    this.forEach((row, y) => {
        row.forEach((symbol, x) => {
            if (symbol === 578 || symbol === 250) {
                objects.push({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                    width: 16,
                    height: 16,
                    draw(c) {
                        c.fillStyle = 'red';
                        c.fillRect(this.position.x, this.position.y, this.width, this.height);
                    },
                })
            }
        })
    })

    return objects
}