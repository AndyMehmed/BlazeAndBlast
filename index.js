let fps = 60; // Set the desired frame rate, e.g., 30 FPS
let lastTime = 0;

class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.scale = 1;
    }

    preRender() {
        c.save();
        c.scale(this.scale, this.scale);
        c.translate(-this.x, -this.y);
    }

    postRender() {
        c.restore();
    }
}

let camera = new Camera();

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1200;
canvas.height = 800;
                    
let parsedCollisions
let collisionBlocks
let background
let doors

const player = new Player({
    imageSrc: './img/king/playerDown.png',
    frameRate: 11,
    animations: {
        idleRight: {
            frameRate: 4,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerDown.png',
        },
        idleDown: {
            frameRate: 4,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerDown.png',
        },
        runRight: {
            frameRate: 4,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerRight.png',
        },
        runLeft: {
            frameRate: 4,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerLeft.png',
        },
        runUp: {
            frameRate: 4,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerUp.png'
        },
        runDown: {
            frameRate: 4,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerDown.png'
        },
        idleLeft: {
            frameRate: 4,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerDown.png',
        },
        idleUp: {
            frameRate: 4,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerDown.png',
        },
        enterDoor: {
            frameRate: 4,
            frameBuffer: 4,
            loop: false,
            imageSrc: './img/king/playerUp.png',
            onComplete: () => {
                console.log('completed animation')
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level++

                        //REMOVE BEFORE ADDING MORE LEVELS
                        if (level ===4) level = 1
                        levels[level].init()
                        player.switchSprite('idleRight')
                        player.preventInput = false
                        gsap.to(overlay, {
                            opacity: 0
                        })
                    },
                })
            },
        },
    },
})



let level = 1
let levels = {

    //-----LEVEL 1-----//
    1: {
        init: () => {
            parsedCollisions = collisionsLevel1.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 1000
            player.position.y = 65
            if(player.currentAnimation) player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                x: 0,
                y: 0,
            },
            imageSrc: './img/Level2.png',
            })
            
            
            doors = [
                new Sprite({
                    position: {
                        x: 80,
                        y: -50,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                }),
            ]
        },
    },

    //-----LEVEL 2-----//
    2: {
        init: () => {
            parsedCollisions = collisionsLevel2.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 96
            player.position.y = 140

            if(player.currentAnimation) player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                x: 0,
                y: 0,
            },
            imageSrc: './img/Level2.png',
            })



            doors = [
                new Sprite({
                    position: {
                        x: 772,
                        y: 336,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                }),
            ]
        },
    },

    //-----LEVEL 3-----//
    3: {
        init: () => {
            parsedCollisions = collisionsLevel3.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 750
            player.position.y = 230

            if(player.currentAnimation) player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                x: 0,
                y: 0,
            },
            imageSrc: './img/Level3.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 175,
                        y: 336,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                }),
            ]
        },
    },

}

// Funktion som gör att spelet tror att man inte trycker på tangenterna, 
// detta för att man ska kunna klicka på en tangent samtidigt som en annan utan att den första tangenten ska sluta fungera.
const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
}

const overlay = {
    opacity: 0,
}

function animate(currentTime) {
    window.requestAnimationFrame(animate);
    let elapsedTime = currentTime - lastTime;

    // Check if enough time has passed to draw a new frame
    if (elapsedTime > 1000 / fps) {
        background.draw();
        //collisionBlocks.forEach(collisionBlock => {
        //    collisionBlock.draw();
        //});
        
        doors.forEach((door) => {
            door.draw()
        })

        player.handleInput(keys)
        player.draw()
        player.update()

        c.save()
        c.globalAlpha = overlay.opacity
        c.fillStyle = 'black'
        c.fillRect(0,0, canvas.width, canvas.height)
        c.restore()

        lastTime = currentTime;
    }

}

levels[level].init()
animate()