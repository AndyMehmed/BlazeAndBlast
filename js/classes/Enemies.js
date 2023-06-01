class Enemy {
    constructor(x, y, width, height, imageSrc) {
        this.position = {
            x: x,
            y: y,
        };
        this.width = width; // Set the width of the enemy object to the provided width
        this.height = height; // Set the height of the enemy object to the provided height        
        this.image = new Image(); // Create a new Image object to hold the enemy's sprite or image
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.image.src = imageSrc;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.speed = 0.3;  // Set the speed at which the enemy moves
        this.followingPlayer = false; // Set the initial state of the enemy's behavior to not follow the player


        //Added a timer to make the player take damages every X seconds
        this.damageTimer = null; // Initialize the damage timer as null
        this.damageInterval = 500;  // Set the interval between each damage inflicted by the enemy
    }
  
    draw() {
      if (this.imageLoaded) {
        c.drawImage(
          this.image,
          this.position.x,
          this.position.y,
          this.width,
          this.height
        );
      }
    }
  
    update(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        //followingplayer makes the Enemies follow the player if within a certain distance
        if (distance <= 150) {
            this.followingPlayer = true;
        }

        if (
            player.position.x < this.position.x + this.width &&
            player.position.x + player.width * 0.475 > this.position.x &&
            player.position.y + player.height * 0.475 > this.position.y &&
            player.position.y < this.position.y + this.height
        ) {

        if (!this.damageTimer) {
            player.health -= 20; // Player takes damage
            document.querySelector('#playerHealth').style.width = player.health + '%';

            //Start the damage timer after first hit
            this.damageTimer = setInterval(() => {
                player.health -= 20;
                document.querySelector('#playerHealth').style.width = player.health + '%';
            }, this.damageInterval);
        }
        } else {
        //Clear the damage timer if player is not colliding
        if (this.damageTimer) {
            clearInterval(this.damageTimer);
            this.damageTimer = null;
            }
        }

        if (this.followingPlayer) {
            let newVelocityX = (dx / distance) * this.speed;
            let newVelocityY = (dy / distance) * this.speed;
    
            // Movement and collision in the x-direction
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
    
            // Movement and collision in the y-direction
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