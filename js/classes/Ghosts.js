class Ghost {
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
      this.speed = 0.4;
      this.followingPlayer = false;

      this.damageTimer = null;
      this.damageInterval = 500;

      this.frameRate = 2;
      this.elapserFrames = 0;
  
      // Animation properties
      this.currentFrame = 0;
      this.frameCount = 4; // Number of frames in the animation
  
      // Health properties
      this.health = 100;
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
  
    update(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if the distance is less than or equal to 100, indicating that the ghost should start following the player.
        if (distance <= 400) {
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
      
            // Start the damage timer after the first hit
            this.damageTimer = setInterval(() => {
              player.health -= 20;
              document.querySelector('#playerHealth').style.width = player.health + '%';
            }, this.damageInterval);
          }
        } else {
          // Clear the damage timer if the player is not colliding
          if (this.damageTimer) {
            clearInterval(this.damageTimer);
            this.damageTimer = null;
          }
        }
      
        // Calculate health bar width
        const healthPercentage = this.health / this.maxHealth;
        const healthBarWidth = this.width;
        const remainingHealthBarWidth = healthBarWidth * healthPercentage;
      
        // Draw ghost health bar
        const healthBarHeight = 5;
        const healthBarX = this.position.x;
        const healthBarY = this.position.y + this.height + 5;
        const healthBarColor = 'red';
      
        // Draw the background of the health bar
        c.fillStyle = 'green';
        c.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
      
        // Draw the remaining health bar based on the health percentage
        c.fillStyle = healthBarColor;
        c.fillRect(healthBarX, healthBarY, remainingHealthBarWidth, healthBarHeight);
  
      if (this.followingPlayer) {
        this.velocity.x = (dx / distance) * this.speed;
        this.velocity.y = (dy / distance) * this.speed;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
      }
    }
  }