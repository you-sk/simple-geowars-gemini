import { GAME_CONSTANTS } from '../constants.js';
import { Vector } from '../utils.js';
import { Projectile } from './Projectile.js';

// プレイヤークラス
export class Player {
    constructor(x, y) {
        this.x = x; 
        this.y = y; 
        this.radius = GAME_CONSTANTS.PLAYER.RADIUS; 
        this.color = GAME_CONSTANTS.PLAYER.COLOR;
        this.speed = GAME_CONSTANTS.PLAYER.SPEED; 
        this.shootCooldown = 0;
        this.isInvincible = false; 
        this.invincibilityTimer = 0;
    }
    
    draw(ctx) {
        ctx.save();
        if (this.isInvincible) {
            ctx.globalAlpha = this.invincibilityTimer % 20 < 10 ? 0.5 : 1;
        }
        ctx.fillStyle = this.color; 
        ctx.shadowColor = this.color; 
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    update(inputManager, canvas) {
        if (this.invincibilityTimer > 0) {
            this.invincibilityTimer--;
        } else {
            this.isInvincible = false;
        }

        const movement = inputManager.getMovement();
        const moveVec = new Vector(movement.x, movement.y);
        
        if (moveVec.magnitude > 0) {
            const moveSpeed = this.speed * Math.min(1, moveVec.magnitude);
            moveVec.normalize();
            this.x += moveVec.x * moveSpeed; 
            this.y += moveVec.y * moveSpeed;
        }
        
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        if (this.shootCooldown > 0) this.shootCooldown--;
    }
    
    tryShoot(inputManager) {
        if (this.shootCooldown > 0) return null;
        
        const shooting = inputManager.getShooting();
        const shootVec = new Vector(shooting.x, shooting.y);
        
        if (shootVec.magnitude > 0) {
            shootVec.normalize();
            this.shootCooldown = GAME_CONSTANTS.PLAYER.SHOOT_COOLDOWN;
            return new Projectile(
                this.x, 
                this.y, 
                { x: shootVec.x * GAME_CONSTANTS.PROJECTILE.SPEED, 
                  y: shootVec.y * GAME_CONSTANTS.PROJECTILE.SPEED }
            );
        }
        return null;
    }
    
    makeInvincible() {
        this.isInvincible = true;
        this.invincibilityTimer = GAME_CONSTANTS.PLAYER.INVINCIBILITY_FRAMES;
    }
    
    respawn(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.makeInvincible();
    }
}