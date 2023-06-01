class Ghost {
  constructor(x, y, width, height, imageSrc) {
    this.position = {
      x: x,
      y: y,
    };
    this.width = width; // Set the width of the ghost object to the provided width
    this.height = height; // Set the height of the ghost object to the provided height
    this.image = new Image(); // Create a new Image object to hold the ghost's sprite or image
    this.image.onload = () => {
      this.imageLoaded = true;
      this.frameWidth = this.image.width / this.frameCount; // Width of each frame
    };
    this.image.src = imageSrc;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.speed = 0.4; // Set the speed at which the ghost moves
    this.followingPlayer = false; // Set the initial state of the ghost's behavior to not follow the player

    this.damageTimer = null; // Initialize the damage timer as null
    this.damageInterval = 500; // Set the interval between each damage inflicted by the ghost

    this.frameRate = 2;
    this.elapserFrames = 0;

    // Animation properties
    this.currentFrame = 0;
    this.frameCount = 4; // Number of frames in the animation

    this.originalSprite = imageSrc;  // save the original sprite 
    this.isHit = false;

    // Health properties
    this.health = 100;
  }

  // Handle the hit animation
  handleHit() {
    this.isHit = true;  // set the hit flag
    this.image.src = './img/enemies/ghostHit.png';  // switch to the hit sprite
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
        document.querySelector('#playerHealth').style.width = player.health + '%'; //Animates the html div #playerHealth when taking damage

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


    if (this.followingPlayer) {
      this.velocity.x = (dx / distance) * this.speed;
      this.velocity.y = (dy / distance) * this.speed;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}