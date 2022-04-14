/*
    index.js
    @author     Russell Waring
    @since      2022.04.06
    @version    1
                JavaScript file
 */

const canvas = document.querySelector('canvas');
// Canvas context... used to draw shapes onto the screen. Using the canvas context, can use the canvas API
const c = canvas.getContext('2d');

// 16 x 9 ratio
canvas.width = 1024;
canvas.height = 576;
// Background, helps distinguish from browser window.
c.fillRect(0, 0, 1024, 576);

const gravity = 0.5;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './image/background.png'
});

const shop = new Sprite({
    position: {
        x: 80,
        y: 165
    },
    imageSrc: './image/shop.png',
    scale: 2.6,
    framesMax: 6
});

// PLAYER
// Passing object as parameter
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0 ,
        y: 0
    },
    imageSrc: './image/player1/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 155
    },
    sprites: {
        idle: {
            imageSrc: './image/player1/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './image/player1/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './image/player1/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './image/player1/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './image/player1/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './image/player1/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './image/player1/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 158,
        height: 50
    }
});

// ENEMY
const enemy = new Fighter({
    position: {
        x: 950,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './image/player2/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: './image/player2/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './image/player2/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './image/player2/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './image/player2/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './image/player2/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './image/player2/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './image/player2/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -172,
            y: 50
        },
        width: 165,
        height: 50
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}



decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate)

    // Clear first
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    // Update
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player movement    
   
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
        
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }
    // Player Jumping
    if(player.velocity.y < 0){
        player.switchSprite('jump');
    } else if (player.velocity.y > 0){
        player.switchSprite('fall');
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }
    // Enemy Jumping
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall');
    }

    // Detect for collision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && 
        player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false;
        //document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        gsap.to('#enemyHealth', {
            width: enemy.health + '%',
        })
    }

    // if player misses
    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false;
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent ===2
    ) {
        player.takeHit()
        enemy.isAttacking = false;
        //document.querySelector('#playerHealth').style.width = player.health + '%';
        gsap.to('#playerHealth', {
            width: player.health + '%',
        })
    }

    // if enemy misses
    if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false;
    }

    // End the game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId});
    }
}

animate();

// Event Listeners
// Key Down
window.addEventListener('keydown', (event) => {
    //console.log(event.key);
    // Player keys
    if(!player.dead){
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                player.velocity.y = -15;
                break;
            case ' ':
                player.attack();
                break;
        }
    }   

    // Enemy keys
    if(!enemy.dead){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -15;
                break;
            case 'ArrowDown':
                enemy.attack();
                break;    
        }
    }   
    
    console.log(event.key);
});
// Key Up
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
        break;
        case 'a':
            keys.a.pressed = false;
        break;
    }

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
        break;
    }
    
    console.log(event.key);
});