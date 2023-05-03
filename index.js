//skapar min canvas och döper den till "c" för att göra koden mer lättläslig
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//Höjden och bredden på min canvas
canvas.width = 1024
canvas.height = 576

//konstant som lägger in collision blocks från vårt collision document.
const collisionsMap = []
for (let i = 0; i < collisions.length; i+= 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

//const that looks for the collisionblock in "doors.js".
const doorsmap = []
for (let i = 0; i < doorsData.length; i+= 70) {
    doorsmap.push(doorsData.slice(i, 70 + i))
}


const boundaries = []
const offset = {
    x: -600,
    y: -1250
}

// Here the program is looking for a "1", and if the player collides with a "1" from the doors.js then the character should advance to the next stage.
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1)
        boundaries.push(
            new Boundary({ 
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
        }))
    })
})

const doors = []

const enemies = [
    { x: 100, y: 100, size: 20, speed: 1.5 },
    { x: 700, y: 100, size: 20, speed: 1.2 },
    { x: 100, y: 500, size: 20, speed: 1.8 },
  ]

doorsmap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1)
        doors.push(
            new Boundary({ 
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
        }))
    })
})

const image = new Image()
image.src = './img/Level1.png'

//konstant som gör att man kan ladda in en karaktär
const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

//konstant som laddar in vald bild
const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

//konstant som laddar in vald bild
const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

//konstant som laddar in vald bild
const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

//Här refererar vi till bilderna ovan för att kunna skapa en karaktär
const player = new Sprite({
    position: {
        x: canvas.width / 2  - 170 / 4,
        y: canvas.height / 2.05 + 58 / 2.5
    },
    image: playerDownImage,
    frames: {
        max:4
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

//konstant som avgör var bakgrunden ska positioneras på vår canvas.
const background = new Sprite({ position: {
    x: -600,
    y: -1250
    },
    image: image
})

//här sätter vi kontrollerna som programmet lyssnar på. 
//alla är satta på false för annars hade spelet trott att någon hela tiden trycker ner tangenterna.
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}


//Konst som gör känner efter ifall en rektangel (karaktären) och rektangel2 (kollisionsblocken) stöter på varandra
//så ska inte spelaren fastna i blocket, utan den ska enbart stanna vid kanten så man kan flytta sig ifrån igen.
const movables = [background, ...boundaries, ...doors]

function rectangularCollision({rectangle1, rectangle2}) {
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

const dooropen = {
    initiated: false
}
//funktion som kör alla commando inom animate.
function animate(){
    const animationId = window.requestAnimationFrame(animate)
    background.draw() //Hämtar all information om vår bakgrund och kör den igenom "draw" funktionen, vilket ritar vår bakgrund.
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    doors.forEach((doors) => {
        doors.draw()
    })
    player.draw()

    if (dooropen.initiated) return

    //if sats som kollar ifall vår gubbe går in i en dörr. Och om det händer så kommer gubben till nästa nivå 
    //med hjälp av en overlay som gör skärmen svart sen fade:ar ut i level 2 istället för level 1.
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < doors.length;i++){
            const door = doors[i] 
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: door 
            })
            ) {
                console.log('level complete')
                window.cancelAnimationFrame(animationId)
                dooropen.initiated = true
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    duration: 2,
                    onComplete(){
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 1,
                            onComplete(){
                                animateNewLevel()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 1,
                                })
                            }
                        })
                    }
                })
                break
            }
        }
    }
    //If sats som gör att vår bakgrund rör sig 1.5 pixlar baserat på vilken knapp vi trycker.
    //If-sats som också gör så att gubben stannar ifall den krockar med något av våra kollisionsblock för A (vänster).
    let moving = true
    player.moving = false
    if (keys.w.pressed) {
        player.moving = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length;i++){
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 1.5
                }}
            })
            ) {
                console.log('colliding')
                moving = false
                break
            }
        }
    
        if (moving)
        movables.forEach((movable) => {
            movable.position.y += 1.5;
        });
    }
    //If-sats som också gör så att gubben stannar ifall den krockar med något av våra kollisionsblock för A (vänster)
    if (keys.a.pressed) {
        player.moving = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length;i++){
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x + 1.5,
                    y: boundary.position.y 
                }}
            })
            ) {
                console.log('colliding')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
            movable.position.x += 1.5;
        });
    }
    //If-sats som också gör så att gubben stannar ifall den krockar med något av våra kollisionsblock för S (NER)
    if (keys.s.pressed) {
        player.moving = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length;i++){
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 1.5
                }}
            })
            ) {
                console.log('colliding')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
            movable.position.y -= 1.5;
        });
    }
    //If-sats som också gör så att gubben stannar ifall den krockar med något av våra kollisionsblock för D (Höger)
    if (keys.d.pressed) {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length;i++){
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x - 1.5,
                    y: boundary.position.y 
                }}
            })
            
            ) {
                console.log('colliding')
                moving = false
                break
            }
        }
        

        if (moving)
        movables.forEach((movable) => {
            movable.position.x -= 1.5;
        })
        
    }
    update()
}

animate()



// funktion som lyssnar efter vilka knappar som trycks ner, detta används för att kunna flytta spelaren.
// När knappen trycks ner så ändras det från "false" till "true" och då rör sig spelaren.
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
        keys.w.pressed = true
        break

        case 'a':
        keys.a.pressed = true
        break

        case 's':
        keys.s.pressed = true
        break

        case 'd':
        keys.d.pressed = true
        break
    }
    
})


//funktion som gör att när man släpper knappen så slutar spelaren att röra sig.
//sätter funktionen i "false" igen.
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
        keys.w.pressed = false
            break

        case 'a':
        keys.a.pressed = false
        break

        case 's':
        keys.s.pressed = false
        break

        case 'd':
        keys.d.pressed = false
        break
    }

})

function update() {
    enemies.forEach((enemy) => {
      const dx = player.position.x - enemy.x;
      const dy = player.position.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance > 0) {
        enemy.x += (dx / distance) * enemy.speed;
        enemy.y += (dy / distance) * enemy.speed;
      }
    });
  
    // clear only the area around the enemies
    enemies.forEach((enemy) => {
      c.clearRect(
        enemy.x - enemy.size / 2 - 1,
        enemy.y - enemy.size / 2 - 1,
        enemy.size + 2,
        enemy.size + 2
      );
    });
  
    enemies.forEach((enemy) => {
      c.fillStyle = 'red';
      c.fillRect(enemy.x - enemy.size / 2, enemy.y - enemy.size / 2, enemy.size, enemy.size);
    });
  }
  

  