// Funktion som "lyssnar" efter vilka tangenter man trycker för att sedan göra det som man ber dem om.

window.addEventListener('keydown', (event) => {
    if (player.preventInput) return;
    switch (event.key) {
        case 'w':
            // move player up
            keys.w.pressed = true;
            break;
        case 'e':
            for (let i = 0; i < doors.length; i++) {
                const door = doors[i];

                if (
                    player.hitbox.position.x + (player.hitbox.width) <= door.position.x + door.width &&
                    player.hitbox.position.x + (player.hitbox.width) >= door.position.x &&
                    player.hitbox.position.y + (player.hitbox.height) >= door.position.y &&
                    player.hitbox.position.y <= door.position.y + door.height
                ) {
                    player.velocity.x = 0;
                    player.velocity.y = 0;
                    player.preventInput = true;
                    player.switchSprite('enterDoor');
                    door.play();
                    return;
                }
            }
            break;
        case 'a':
            // move player to the left
            keys.a.pressed = true;
            break;
        case 'd':
            // move player to the right
            keys.d.pressed = true;
            break;
        case 's':
            // move player down
            keys.s.pressed = true;
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        case 'e':
            // when the 'e' key is released, we don't want to do anything, but we need to include it to prevent console errors.
            break;
    }
});