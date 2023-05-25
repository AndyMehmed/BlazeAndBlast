class Ghost {
    constructor(x, y, width, height, imageSrc, animations, frameBuffer, frameRate) {
        this.position = {
            x: x,
            y: y,
        };
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.image.src = imageSrc;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.speed = 0.3;
        this.followingPlayer = false;
        this.damageTimer = null;
        this.damageInterval = 500;
        this.loaded = false;
        this.animations = animations;
        this.currentAnimation = null;
        this.frameRate = 1;
        this.frameBuffer = 2;
        this.currentFrame = 0;
        this.elapserFrames = 0;

        // Animation properties
        this.currentFrame = 0;
        this.frameCount = 4; // Number of frames in the animation
        this.frameWidth = this.image.width / this.frameCount; // Width of each frame
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

    draw() {
        if (this.imageLoaded) {
            if (this.currentAnimation) {
                this.drawAnimation();
            } else {
                c.drawImage(
                    this.image,
                    this.position.x,
                    this.position.y,
                    this.width,
                    this.height
                );
            }
        }
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