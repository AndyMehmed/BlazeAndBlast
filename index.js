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

const boundaries = []
const offset = {
    x: -600,
    y: -1250
}

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
const movables = [background, ...boundaries ]

function rectangularCollision({rectangle1, rectangle2}) {
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}
//funktion som kör alla commando inom animate.
function animate(){
    window.requestAnimationFrame(animate)
    background.draw() //Hämtar all information om vår bakgrund och kör den igenom "draw" funktionen, vilket ritar vår bakgrund.
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    player.draw()

    //If sats som gör att vår bakgrund rör sig 1.5 pixlar baserat på vilken knapp vi trycker.
    //If-sats som också gör så att gubben stannar ifall den krockar med något av våra kollisionsblock för A (vänster).
    //Denna IF-satsen fungerar endas för W så kommer att kopiera samma kod 4 gånger för A,S,D också.
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
        });
    }
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