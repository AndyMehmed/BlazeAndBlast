//Canvas with is 70 tiles so the program is looking through the 70 tiles and then "jump down" a row to check the next 70 tiles
Array.prototype.parse2D = function() {
    const rows =  []
    for (let i = 0; i < this.length; i+=70) {
        rows.push(this.slice(i, i + 70))
    }

    return rows
}
//After the program has looked through all of the rows it looks for symbol 578 and 250.
//Symbol 578 is where the collisionblocks are spawned and 250 is where our door is supposed to be interacted with.
//It then draws out these 2 blocks on our canvas based on the code given in "collisions.js"
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
                })
            }
        })
    })

    return objects
}