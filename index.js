let fps = 60; // Set the desired frame rate, e.g., 30 FPS
let lastTime = 0;

let camera = new Camera();

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1200;
canvas.height = 800;

const enemies = [];
const ghosts = [];

const enemy1 = new Enemy(400, 300, 20, 20, 'blue');
const enemy2 = new Enemy(800, 200, 20, 20, 'yellow');

const ghost1 = new Ghost(200, 300, 20, 20, 'black');
const ghost2 = new Ghost(600, 200, 20, 20, 'purple');

enemies.push(enemy1, enemy2);
ghosts.push(ghost1, ghost2);
                    
let parsedCollisions
let collisionBlocks
let background
let doors

const player = new Player({
    health: 100,

    imageSrc: './img/king/playerIdle.png',
    frameRate: 11,
    animations: {
        idleRight: {
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerIdle.png',
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
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerIdle.png',
        },
        idleUp: {
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerIdle.png',
        },
        idleDown: {
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/playerIdle.png',
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

const healthBar = new HealthBar(player, 100); // Assuming 100 is the max health

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
                        x: 120,
                        y: 35,
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
            imageSrc: './img/Level2.png',
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

function gameOver() {
    // Display a game over message
    c.fillStyle = "red";
    c.font = "50px Arial";
    c.fillText("Game Over", canvas.width / 2, canvas.height / 2);

    // You could add more game over logic here, such as a button to restart the game.
}

function animate(currentTime) {
    if (player.health <= 0) {
        gameOver();
        return;
    }
    window.requestAnimationFrame(animate);
    let elapsedTime = currentTime - lastTime;

    // Check if enough time has passed to draw a new frame
    if (elapsedTime > 1000 / fps) {
        camera.x = player.position.x - canvas.width / 2 / camera.scale;  // account for scaling
        camera.y = player.position.y - canvas.height / 2 / camera.scale;  // account for scaling
        camera.scale = 0.9;  // 80% zoom
        //background.draw(); Remove this line

        // increase camera scale to zoom in
        camera.scale = 3;  // 200% zoom
        camera.preRender();
        background.draw();
        doors.forEach((door) => {
            door.draw();
        });

        enemies.forEach((enemy) => {
            enemy.update(player);
            enemy.draw();
        });

        ghosts.forEach((ghost) => {
            ghost.update(player);
            ghost.draw();
        });

        player.handleInput(keys);
        player.draw();
        player.update();
        

        c.save();
        c.globalAlpha = overlay.opacity;
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.restore();

        lastTime = currentTime;
    }
    camera.postRender();
    healthBar.draw();
}

levels[level].init()
animate()