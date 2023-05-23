class Player extends Sprite {
    constructor({ collisionBlocks = [], imageSrc, frameRate, animations, loop }) {
        super({ imageSrc, frameRate, animations, loop });

        this.position = {
            x: 200,
            y: 200,
        };

        this.velocity = {
            x: 0,
            y: 0,
        };

        this.speed = 1.5

        //this.sides, row 16-18 is not needed
        this.sides = {
            bottom: this.position.y + this.height,
        };
        //this.collisionBlocks, row 20 is not needed
        this.collisionBlocks = collisionBlocks;
    }

draw() {
    if (!this.loaded) return;
    const cropbox = {
        position: {
            x: this.width * this.currentFrame,
            y: 0,
        },
        width: this.width,
        height: this.height,
    };

    // Scale factors
    const scaleWidth = this.width * 0.5; // 50% of the original width
    const scaleHeight = this.height * 0.5; // 50% of the original height

    c.drawImage(
        this.image,
        cropbox.position.x,
        cropbox.position.y,
        cropbox.width,
        cropbox.height,
        this.position.x,
        this.position.y,
        scaleWidth,
        scaleHeight
    );

    this.updateFrames();
}

update() {
    this.position.x += this.velocity.x * this.speed
    this.updateHitbox();
    this.checkForHorizontalCollisions();

    this.position.y += this.velocity.y * this.speed
    this.updateHitbox();
    this.checkForVerticalCollisions();
}

handleInput(keys) {
    if (this.preventInput) return;

    player.velocity.x = 0;
    player.velocity.y = 0;

    // Handle horizontal movement
    if (keys.d.pressed) {
        this.switchSprite('runRight');
        player.velocity.x += player.speed;
        this.lastDirection = 'right';
    };
    
    if (keys.a.pressed) {
        this.switchSprite('runLeft');
        player.velocity.x -= player.speed;
        this.lastDirection = 'left';
    };

    // Handle vertical movement
    if (keys.w.pressed) {
        this.switchSprite('runUp');
        player.velocity.y -= player.speed; // moving up
        this.lastDirection = 'up';
    }
    
    if (keys.s.pressed) {
        this.switchSprite('runDown');
        player.velocity.y += player.speed; // moving down
        this.lastDirection = 'down';
    }

    // if moving diagonally, reduce speed
    if ((keys.w.pressed || keys.s.pressed) && (keys.a.pressed || keys.d.pressed)) {
        player.velocity.x *= 0.75;
        player.velocity.y *= 0.75;
    }
    // Dela upp diagonalen i egna if statements och lägg in sprite animation för varje

    // Handle idle state
    if (!keys.d.pressed && !keys.a.pressed && !keys.w.pressed && !keys.s.pressed) {
        if (this.lastDirection === 'left') {
            this.switchSprite('idleLeft');
        } else {
            this.switchSprite('idleRight');
        }
    }
}

switchSprite(name) {
    if (this.image === this.animations[name].image) return;
    this.currentFrame = 0;
    this.image = this.animations[name].image;
    this.frameRate = this.animations[name].frameRate;
    this.frameBuffer = this.animations[name].frameBuffer;
    this.loop = this.animations[name].loop;
    this.currentAnimation = this.animations[name];
}

updateHitbox() {
    this.hitbox = {
        position: {
            x: this.position.x,
            y: this.position.y   
        },
        width: 25,
        height: 35,
    };
}

checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
        const collisionBlock = this.collisionBlocks[i];
    
        // If a collision exists
        if (
            this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
            this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
            this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
            this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
        ) {
            // Collision on x-axis going to the left
            if (this.velocity.x < 0) {
                const offset = this.hitbox.position.x - this.position.x;
                this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                this.velocity.x = 0;  // Reset velocity
                break;
            }
    
            if (this.velocity.x > 0) {
                const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                this.position.x = collisionBlock.position.x - offset - 0.01;
                this.velocity.x = 0;  // Reset velocity
                break;
            }
        }
    }
}
    
checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
        const collisionBlock = this.collisionBlocks[i];
    
        // If a collision exists
        if (
            this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
            this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
            this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
            this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
        ) {
             if (this.velocity.y < 0) {
                this.velocity.y = 0;  // Reset velocity
                const offset = this.hitbox.position.y - this.position.y;
                this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                break;
            }
    
            if (this.velocity.y > 0) {
                this.velocity.y = 0;  // Reset velocity
                const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
                this.position.y = collisionBlock.position.y - offset - 0.01;
                break;
            }
        }
    }
}
}