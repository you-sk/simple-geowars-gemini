import { GAME_CONSTANTS } from '../constants.js';

// 敵クラス
export class Enemy {
    constructor(x, y, radius, color, velocity, type = 'seeker') {
        this.x = x; 
        this.y = y; 
        this.radius = radius; 
        this.color = color; 
        this.velocity = velocity;
        this.type = type;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = this.color; 
        ctx.shadowColor = this.color; 
        ctx.shadowBlur = 20; 
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.radius); 
        ctx.lineTo(this.x + this.radius, this.y);
        ctx.lineTo(this.x, this.y + this.radius); 
        ctx.lineTo(this.x - this.radius, this.y);
        ctx.closePath(); 
        ctx.stroke();
        ctx.restore();
    }
    
    update(player) {
        if(this.type === 'seeker') {
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            this.velocity.x = Math.cos(angle); 
            this.velocity.y = Math.sin(angle);
        }
        this.x += this.velocity.x * GAME_CONSTANTS.ENEMY.BASE_SPEED; 
        this.y += this.velocity.y * GAME_CONSTANTS.ENEMY.BASE_SPEED;
    }
    
    checkCollision(other) {
        const dist = Math.hypot(this.x - other.x, this.y - other.y);
        return dist < this.radius + other.radius;
    }
}