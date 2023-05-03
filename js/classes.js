//funktion som gör att allt ritas på canvasen, samt kör olika kommando igenom en constructor. 
//Detta för att kunna skicka med all nödvändig information.
class Sprite {
    constructor({
        position, 
        velocity, 
        image,
        frames = { max: 1},
        sprites
    }) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
    }

    draw() {
        //Funktion som gör att vi hämtar bilden som är gjord i Tiles och sätter den som vår canvas.
        c.drawImage
        (this.image, //nedan följer kordinater som gör att man får 1 gubbe att visas istället för 4.
        this.frames.val * this.width,
        0,
        this.image.width / this.frames.max,
        this.image.height,
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max,
        this.image.height,
        )

        if (!this.moving) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % 28 === 0) {
        if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
}

//class som hittar alla collision blocks och loggar dem i consolen
class Boundary {
    static width = 48
    static height = 48
    constructor(position) {
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Enemy {
    constructor({ x, y, size, speed }) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = speed;
    }

    draw() {
      c.fillStyle = 'red';
      c.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    update(player, boundaries) {
        const dx = player.position.x - this.x;
        const dy = player.position.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
      
        if (distance > 0) {
          const nextX = this.x + (dx / distance) * this.speed;
          const nextY = this.y + (dy / distance) * this.speed;
      
          let collision = false;
          for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
              rectangle1: { position: { x: nextX, y: nextY }, width: this.size, height: this.size },
              rectangle2: boundary
            })) {
              collision = true;
              break;
            }
          }
      
          if (!collision) {
            this.x = nextX;
            this.y = nextY;
          }
        }
      }
      
  }