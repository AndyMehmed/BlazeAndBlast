class Sprite {
    constructor({ position, imageSrc, frameRate = 1, animations, frameBuffer = 2, loop = true, autoplay = true }) {
        this.position = position;
        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
            this.width = this.image.width / this.frameRate;
            this.height = this.image.height;
        };
        // All function below are describing the deifferent animation functions and basically the name describes itself
        this.image.src = imageSrc;
        this.loaded = false;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.elapserFrames = 0;
        this.frameBuffer = frameBuffer;
        this.animations = animations;
        this.loop = loop;
        this.autoplay = autoplay;
        this.currentAnimation = null;

        // Looks if there is any existing animation property and then loops over every itteration from the "animations" object in our code
        if (this.animations) {
            for (let key in this.animations) {
                const image = new Image();
                image.src = this.animations[key].imageSrc;
                this.animations[key].image = image;
            }
        }
    }

    // A draw method that draws all of our sprites when called upon other places in the code
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
    // Here the images are beeing drawn based on the set parameters
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

    //Self explanitory
    play() {
        this.autoplay = true;
    }

    //Updates the frames of our animations based on the set parameters 'autoplay', 'framebuffer' etc.
    //And when the certain conditions are met the onComplete function is run to make sure its all correct. 
    updateFrames() {
        if (!this.autoplay) return;
        this.elapserFrames++;

        if (this.elapserFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
            else if (this.loop) this.currentFrame = 0;
        }

        if (this.currentAnimation && this.currentAnimation.onComplete) {
            if (this.currentFrame === this.frameRate - 1 && !this.currentAnimation.isActive) {
                this.currentAnimation.onComplete();
                this.currentAnimation.isActive = true;
            }
        }
    }
}