// パーティクルクラス
export class Particle {
    constructor(x, y, color, velocity, size, life) {
        this.x = x; 
        this.y = y; 
        this.color = color; 
        this.velocity = velocity;
        this.size = size; 
        this.life = life; 
        this.initialLife = life;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life / this.initialLife;
        ctx.fillStyle = this.color; 
        ctx.shadowColor = this.color; 
        ctx.shadowBlur = 10;
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); 
        ctx.fill();
        ctx.restore();
    }
    
    update() { 
        this.x += this.velocity.x; 
        this.y += this.velocity.y; 
        this.life--; 
    }
    
    isAlive() {
        return this.life > 0;
    }
}