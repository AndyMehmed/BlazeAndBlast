class Spirit {
  constructor(x, y, width, height, imageSrc) {
    this.position = {
      x: x,
      y: y,
    };
    this.width = width; // Set the width of the spirit object to the provided width
    this.height = height; // Set the height of the spirit object to the provided height
    this.image = new Image();  // Create a new Image object to hold the spirit's sprite or image
    this.image.onload = () => {
      this.imageLoaded = true;
      this.frameWidth = this.image.width / this.frameCount; // Width of each frame
    };
    this.image.src = imageSrc;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.speed = 0.5; // Set the speed at which the spirit moves
    this.followingPlayer = false; // Set the initial state of the spirit's behavior to not follow the player

    this.damageTimer = null; // Initialize the damage timer as null
    this.damageInterval = 500; // Set the interval between each damage inflicted by the spirit

    // Animation properties
    this.frameRate = 2; // Set the frame rate for the spirit's animation
    this.elapserFrames = 0; // Initialize the frame counter

    // Animation properties
    this.currentFrame = 1;
    this.frameCount = 4; // Number of frames in the animation

    this.originalSprite = imageSrc;  // save the original sprite 
    this.isHit = false;

    this.health = 100; // Starting health value
  }

  handleHit() {
    this.isHit = true;  // set the hit flag
    this.image.src = './img/enemies/spiritHit.png';  // switch to the hit sprite
    this.currentFrame = 0;  // start at the first frame
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

    if (this.isHit) {
      // If we're playing the hit animation and we've reached the last frame
      if (this.elapserFrames % (10 * this.frameRate) === 0) {
        this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        if (this.currentFrame == 0) {
          this.isHit = false;  // Reset the hit flag
          this.image.src = this.originalSprite;  // switch back to the original sprite
        }
      }
    } else if (this.elapserFrames % (10 * this.frameRate) === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
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

    // followingplayer makes the Enemies follow the player if within a certain distance
    if (distance <= 200) {
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
        document.querySelector('#playerHealth').style.width = player.health + '%'; //Animates the html div #playerHealth when taking damage

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