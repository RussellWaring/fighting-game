/*
    classes.js
    @author     Russell Waring
    @since      2022.04.07
    @version    1
                Contains the classes used in this program. This program was created following the Tutorial on YouTube,
                "JavaScript Fighting Game Tutorial with HTML Canvas" (https://www.youtube.com/watch?v=vyqbNFMDRGQ).
*/

class Sprite{
    // constructor
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}){
        // Main property
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.offset = offset;
        };
    

    // public methods
    draw(){      
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax), // crop location
            0, 
            this.image.width / this.framesMax, // crop width
            this.image.height, // crop height
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        );
    }

    animateFrames() {
        this.framesElapsed++;

        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++;
            }
            else{
                this.framesCurrent = 0;
            }
        }
    }

    // Properties to 'update' when moving
    update(){
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite{
    // constructor
    constructor({
        position, 
        velocity, 
        color, 
        imageSrc, 
        scale = 1, 
        framesMax = 1, 
        offset = {x: 0, y: 0}, 
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined}
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        });
        // Main property
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        };
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    // Properties to 'update' when moving
    update(){
        this.draw();     
        if (!this.dead) this.animateFrames();

        // Attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // Draw the attack box - testing purposes
        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x; // x-axis
        this.position.y += this.velocity.y; // y-axis, gravity
        
        // Gravity function - Comparing object height to canvas 'bottom'
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 78){
            this.velocity.y = 0;
            this.position.y = 348;
        }else this.velocity.y += gravity;
    }

    attack(){
        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    takeHit(){        
        this.health -= 20;

        if (this.health <= 0){
            this.switchSprite('death');
        } else{
            this.switchSprite('takeHit');
        }
    }

    /**
     * Responsible for switching between different sprites
     */
    switchSprite(sprite){
        if (this.image === this.sprites.death.image){
            if (this.framesCurrent === this.sprites.death.framesMax -1) this.dead = true;
            return
        }

        // Overrides all other animations with the attack animation
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return

        // Overrides all other animations with the taking hit animation
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return

        switch(sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image; // default image
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }                    
            break;

            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }                    
            break;

            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
            break;

            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
            break;

            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
            break;

            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
            break;

            case 'death':
                if(this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
            break;
        }
    }
}