import { GAME_CONSTANTS } from '../constants.js';

// 弾丸クラス
export class Projectile {
    constructor(x, y, velocity) {
        this.x = x; 
        this.y = y; 
        this.radius = GAME_CONSTANTS.PROJECTILE.RADIUS; 
        this.color = GAME_CONSTANTS.PROJECTILE.COLOR; 
        this.velocity = velocity;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color; 
        ctx.shadowColor = this.color; 
        ctx.shadowBlur = 15;
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
        ctx.fill();
        ctx.restore();
    }
    
    update() { 
        this.x += this.velocity.x; 
        this.y += this.velocity.y; 
    }
    
    isOutOfBounds(canvas) {
        return this.x < 0 || this.x > canvas.width || 
               this.y < 0 || this.y > canvas.height;
    }
}