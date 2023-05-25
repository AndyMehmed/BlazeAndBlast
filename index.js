let camera = new Camera();

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth;
canvas.height = innerHeight;

const projectiles = [];
const enemies = [];
const ghosts = [];

let parsedCollisions
let collisionBlocks
let background
let doors


const player = new Player({

    imageSrc: './img/PlayerSprite/playerIdle.png',

    health: 100,


    frameRate: 11,
    animations: {
        idleRight: {
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/PlayerSprite/idleRight.png',
        },
        runRight: {
            frameRate: 4,
            frameBuffer: 30,
            loop: true,
            imageSrc: './img/PlayerSprite/playerRight.png',
        },
        runLeft: {
            frameRate: 4,
            frameBuffer: 30,
            loop: true,
            imageSrc: './img/PlayerSprite/playerLeft.png',
        },
        runUp: {
            frameRate: 4,
            frameBuffer: 30,
            loop: true,
            imageSrc: './img/PlayerSprite/playerUp.png'
        },
        runDown: {
            frameRate: 4,
            frameBuffer: 30,
            loop: true,
            imageSrc: './img/PlayerSprite/playerDown.png'
        },
        idleLeft: {
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/PlayerSprite/idleLeft.png',
        },
        idleUp: {
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/PlayerSprite/idleUp.png',
        },
        idleDown: {
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/PlayerSprite/playerIdle.png',
        },

        enterDoor: {
            frameRate: 4,
            frameBuffer: 4,
            loop: false,
            imageSrc: './img/PlayerSprite/playerUp.png',
            onComplete: () => {
                console.log('completed animation')
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level++

                        //REMOVE BEFORE ADDING MORE LEVELS
                        if (level ===5) level = 1
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
            enemies.length = 0;
            ghosts.length = 0;
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
            imageSrc: './img/Maps/Level2.png',
            })

            item = new Sprite({
                position: {
                    x: 976,
                    y: 25,
                },
                imageSrc: './img/Items/Torch.png',
                animations: {
                    defaultAnimation: {
                        imageSrc: './img/Items/Torch.png',
                        frameRate: 4,
                        
                    },
                },
                frameRate: 4, // Specify the total number of frames in the animation
                frameBuffer: 16,
            });

            item3 = new Sprite({
                position: {
                    x: 1040,
                    y: 25,
                },
                imageSrc: './img/Items/Torch.png',
                animations: {
                    defaultAnimation: {
                        imageSrc: './img/Items/Torch.png',
                        frameRate: 4,
                        
                    },
                },
                frameRate: 4, // Specify the total number of frames in the animation
                frameBuffer: 16,
            });
            
            item2 = new Sprite({
                position: {
                    x: 840,
                    y: 100,
                },
                imageSrc: './img/Items/Spike_trap.png',
                animations: {
                    defaultAnimation: {
                        imageSrc: './img/Items/Spike_trap.png',
                        frameRate: 4,
                        
                    },
                },
                frameRate: 3, // Specify the total number of frames in the animation
                frameBuffer: 100,
            });

        // Create enemy instances
        const enemy1 = new Enemy(900, 380, 20, 20, './img/enemies/spiritDown.png', {
            // Animation configurations for enemy1
            idle: {
            imageSrc: './img/enemies/spiritDown.png',
            frameRate: 4,
            loop: true
            },
            run: {
            imageSrc: './img/enemies/spiritDown.png',
            frameRate: 4,
            loop: true
            }
        });
  
        const enemy2 = new Enemy(200, 200, 20, 20, './img/enemies/spiritDown.png', {
            // Animation configurations for enemy2
            idle: {
            imageSrc: './img/enemies/spiritDown.png',
            frameRate: 4,
            loop: false
            },
            run: {
            imageSrc: './img/enemies/spiritDown.png',
            frameRate: 4,
            loop: true
            }
        });

        const ghost1 = new Ghost(400, 300, 20, 20, './img/enemies/ghost.png', {
            // Animation configurations for enemy2
            idle: {
            imageSrc: './img/enemies/ghost.png',
            frameRate: 4,
            loop: false
            },
            run: {
            imageSrc: './img/enemies/ghost.png',
            frameRate: 4,
            loop: true
            }
        });

        const ghost2 = new Ghost(500, 300, 20, 20, './img/enemies/ghost.png', {
            // Animation configurations for enemy2
            idle: {
            imageSrc: './img/enemies/ghost.png',
            frameRate: 4,
            loop: true
            },
            run: {
            imageSrc: './img/enemies/ghost.png',
            frameRate: 4,
            loop: true
            }
        });

            enemies.push(enemy1, enemy2);
            ghosts.push(ghost1, ghost2);
            
            
            doors = [
                new Sprite({
                    position: {
                        x: 96,
                        y: 18,
                    },
                    imageSrc: './img/DoorSprite/door2.png',
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
            enemies.length = 0;
            ghosts.length = 0;
            parsedCollisions = collisionsLevel2.parse2D()
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
            imageSrc: './img/Maps/Level2.png',
            })

            // Create enemy instances
        const enemy1 = new Enemy(100, 100, 20, 20, './img/enemies/spiritDown.png', {
            // Animation configurations for enemy1
            idle: {
            imageSrc: './img/enemies/spiritDown.png',
            frameRate: 4,
            frameBuffer: 2,
            loop: true
            },
            run: {
            imageSrc: './img/enemies/spiritDown.png',
            frameRate: 4,
            frameBuffer: 30,
            loop: true
            }
        });
  
        const enemy2 = new Enemy(200, 200, 20, 20, './img/enemies/spiritDown.png', {
            // Animation configurations for enemy2
            idle: {
            imageSrc: './img/enemies/spiritDown.png',
            frameRate: 4,
            frameBuffer: 2,
            loop: true
            },
            run: {
            imageSrc: './img/enemies/spiritDown.png',
            frameRate: 4,
            frameBuffer: 30,
            loop: true
            }
        });


        const ghost1 = new Ghost(400, 300, 20, 20, './img/enemies/ghost.png', {
            // Animation configurations for enemy2
            idle: {
            imageSrc: './img/enemies/ghost.png',
            frameRate: 4,
            frameBuffer: 2,
            loop: true
            },
            run: {
            imageSrc: './img/enemies/ghost.png',
            frameRate: 4,
            frameBuffer: 30,
            loop: true
            }
        });

        const ghost2 = new Ghost(500, 300, 20, 20, './img/enemies/ghost.png', {
            // Animation configurations for enemy2
            idle: {
            imageSrc: './img/enemies/ghost.png',
            frameRate: 4,
            frameBuffer: 2,
            loop: true
            },
            run: {
            imageSrc: './img/enemies/ghost.png',
            frameRate: 4,
            frameBuffer: 30,
            loop: true
            }
        });

            enemies.push(enemy1, enemy2);
            ghosts.push(ghost1, ghost2);

            doors = [
                new Sprite({
                    position: {
                        x: 96,
                        y: 18,
                    },
                    imageSrc: './img/DoorSprite/door2.png',
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
            enemies.splice(0);
            ghosts.splice(0);
            parsedCollisions = collisionsLevel3.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 45
            player.position.y = 330

            if(player.currentAnimation) player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                x: 0,
                y: 0,
            },
            imageSrc: './img/Maps/Level3.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 175,
                        y: 336,
                    },
                    imageSrc: './img/DoorSprite/door2.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                }),
            ]
        },
    },


    //-----LEVEL 4-----//
    4: {
        init: () => {
            parsedCollisions = collisionsLevel4.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 57
            player.position.y = 258

            if(player.currentAnimation) player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                x: 0,
                y: 0,
            },
            imageSrc: './img/Maps/Level4.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 175,
                        y: 336,
                    },
                    imageSrc: './img/door2.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                }),
            ]
        },
    },
    
}

// Function that makes the game think that you are not pressing the keys, 
// this is to be able to click on one key at the same time as another without the first key stop working
const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

const overlay = {
    opacity: 0,
}

function gameOver() {
    // Load the game over image
    const gameOverImage = new Image();
    gameOverImage.src = './img/game.over.png';

    gameOverImage.onload = function() {
        // Draw the game over image
        c.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);
    }

    // You could add more game over logic here, such as a button to restart the game.
}


function animate() {
    if (player.health <= 0) {
      gameOver();
      return;
    }
    window.requestAnimationFrame(animate);
  
    camera.x = player.position.x - canvas.width / 2 / camera.scale;
    camera.y = player.position.y - canvas.height / 2 / camera.scale;
  
    // increase camera scale to zoom in
    camera.scale = 4; // 300% zoom (The higher the more zoomed in)
    camera.preRender();
  
    // Draw the background first
    background.draw();
  
    // Draw the doors
    doors.forEach((door) => {
      door.draw();
    });
  
    // Draw the items
    if (level === 1,2) {
      item.draw();
      item2.draw();
      item3.draw();
    }
  
    // Draw the enemies
    enemies.forEach((enemy) => {
      enemy.update(player);
      enemy.drawAnimation();
    });
  
    // Draw the ghosts
    ghosts.forEach((ghost) => {
      ghost.update(player);
      ghost.drawAnimation();
    });
    projectiles.forEach((projectile, index) => {
        projectile.update();
    
        for (let i = 0; i < collisionBlocks.length; i++) {
            const collisionBlock = collisionBlocks[i];
            
            if (
                projectile.x - projectile.radius < collisionBlock.position.x + collisionBlock.width &&
                projectile.x + projectile.radius > collisionBlock.position.x &&
                projectile.y + projectile.radius > collisionBlock.position.y &&
                projectile.y - projectile.radius < collisionBlock.position.y + collisionBlock.height
            ) {
                // Projectile has hit a collisionBlock (wall), remove it
                projectiles.splice(index, 1);
                break;  // Exit the loop early since we've removed the projectile
            }
        }
    
        enemies.forEach((enemy, enemyIndex) => {
            if (projectile.checkCollision(enemy)) {
                // Projectile has hit the enemy
                // Do something with enemy radius here
                if (enemy.radius - 10 > 10) {
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        // Remove the projectile
                        projectiles.splice(index, 1)
                    }, 0)
                } else {
                    setTimeout(() => {
                        // Remove the enemy and the projectile
                        enemies.splice(enemyIndex, 1)
                        projectiles.splice(index, 1)
                    }, 0)
                }
            }
        });
    
        ghosts.forEach((ghost, ghostIndex) => {
            if (projectile.checkCollision(ghost)) {
                // Projectile has hit the ghost, remove them
                projectiles.splice(index, 1);
                ghosts.splice(ghostIndex, 1);
                // Perform any other necessary actions (e.g., reduce ghost health)
            }
        });
    
        // Check if the projectile is outside of the canvas
        if (
            projectile.x + projectile.radius < 0 || 
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            projectiles.splice(index, 1);
        }
    });
    
    
    
  
    player.handleInput(keys);
    player.draw();
    player.update();
  
    // Draw the overlay
    c.save();
    c.globalAlpha = overlay.opacity;
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.restore();
  
    camera.postRender();
}

levels[level].init()
animate()