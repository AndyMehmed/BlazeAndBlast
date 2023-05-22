// The Sprite class represents a graphic element used for animations or games.
// It takes in an object with properties like position, image source, frame rate, animations, frame buffer, loop behavior, and autoplay setting.

class Sprite {
    constructor({position, 
                imageSrc, 
                frameRate = 1, 
                animations, 
                frameBuffer = 2,
                loop = true, 
                autoplay = true,
        }) {
         // Store the initial position of the sprite.
        this.position = position

        // Create a new Image object to hold the sprite's image.
        this.image= new Image()

        // When the image is loaded, set the 'loaded' flag to true and calculate the width and height of the sprite.
        this.image.onload = () => {
        this.loaded = true
        this.width = this.image.width / this.frameRate
        this.height = this.image.height
        }

        // Set the image source and mark the sprite as not loaded.
        this.image.src = imageSrc
        this.loaded = false

         // Set the frame rate, current frame, elapsed frames, frame buffer, animations, loop behavior, and autoplay settings.
        this.frameRate = frameRate
        this.currentFrame = 0
        this.elapserFrames = 0
        this.frameBuffer = frameBuffer
        this.animations = animations
        this.loop = loop
        this.autoplay = autoplay
        this.currentAnimation

        // If animations are provided, load the associated images and assign them to their respective animations.
        if (this.animations) {
            for (let key in this.animations) {
                const image = new Image()
                image.src = this.animations[key].imageSrc
                this.animations[key].image = image
            }

            // Output the animations object to the console.
            console.log(this.animations)
        }
    }


draw() {

    // If the sprite is not loaded, do nothing
    if (!this.loaded) return

    // Determine the portion of the sprite sheet to draw (current frame)
    const cropbox = {
        position: {
            x: this.width * this.currentFrame,
            y: 0,
        },
        width: this.width,
        height: this.height,
    }

    // Draw the sprite on the canvas at the specified position
    c.drawImage(this.image, 
                cropbox.position.x, 
                cropbox.position.y, 
                cropbox.width, 
                cropbox.height, 
                this.position.x, 
                this.position.y,
                this.width,
                this.height
            )

            // Update the frame counter and animation state
            this.updateFrames()
        }

        play(){
            // Enable automatic playback of the sprite's animation
            this.autoplay = true
        }

updateFrames() {

    // If automatic playback is not enabled, do nothing
    if (!this.autoplay) return

    // Increment the frame counter
    this.elapserFrames++

    // Check if it's time to advance to the next frame
    if (this.elapserFrames % this.frameBuffer ===0) {

        // Move to the next frame if not at the last frame
        if (this.currentFrame < this.frameRate -1 ) this.currentFrame++

        // Restart from the first frame if looping is enabled and at the last frame
        else if(this.loop) this.currentFrame = 0
    }

     // Check if the current animation has a completion callback and if it should be triggered
    if (this.currentAnimation?.onComplete){
        if (this.currentFrame === this.frameRate - 1 && !this.currentAnimation.isActive
        ) {

         // Trigger the completion callback and mark the animation as completed
        this.currentAnimation.onComplete()
        this.currentAnimation.isActive = true
        }
    }
}   
}

