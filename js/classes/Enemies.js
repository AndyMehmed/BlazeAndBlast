class Enemy {
    constructor(x, y, width, height, imageSrc) {
        this.position = {
            x: x,
            y: y,
        };
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.onload = () => {
            this.imageLoaded = true;
            this.frameWidth = this.image.width / this.frameCount; // Width of each frame
        };
        this.image.src = imageSrc;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.speed = 0.5;
        this.followingPlayer = false;

        this.damageTimer = null;
        this.damageInterval = 500;
        
        this.frameRate = 1;
        this.elapserFrames = 0;

        // Animation properties
        this.currentFrame = 0;
        this.frameCount = 4; // Number of frames in the animation
    }

    drawAnimation() {
        if (!this.imageLoaded) return;

        const cropbox = {
            position: {
                x: this.frameWidth * this.currentFrame,
                y: 0,
            },
            width: this.frameWidth,
            height: this.image.height,
        };

        c.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        this.updateFrames();
    }

    updateFrames() {
        this.elapserFrames++; // Increment the frame counter
    
        if (this.elapserFrames % (10 * this.frameRate) === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    update(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        //followingplayer makes the Enemies follow the player if within a certain distance
        if (distance <= 100) {
            this.followingPlayer = true;
        }
    
        if (
            player.position.x < this.position.x + this.width &&
            player.position.x + player.width * 0.47 > this.position.x &&
            player.position.y + player.height * 0.47 > this.position.y &&
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
            const newVelocityX = (dx / distance) * this.speed;
            const newVelocityY = (dy / distance) * this.speed;
    
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
                        this.velocity.x = 0; // Reset velocity
                        break;
                    }
                    if (this.velocity.x > 0) {
                        this.position.x = collisionBlock.position.x - this.width - 0.01;
                        this.velocity.x = 0; // Reset velocity
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
                        this.velocity.y = 0; // Reset velocity
                        break;
                    }
                    if (this.velocity.y > 0) {
                        this.position.y = collisionBlock.position.y - this.height
                        this.velocity.y = 0; // Reset velocity
                    break;
                }
            }
        }
    }
    }
}