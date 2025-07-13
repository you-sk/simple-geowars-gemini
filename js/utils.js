// ユーティリティクラス

export class Vector {
    constructor(x, y) { 
        this.x = x; 
        this.y = y; 
    }
    
    get magnitude() { 
        return Math.sqrt(this.x * this.x + this.y * this.y); 
    }
    
    normalize() {
        const mag = this.magnitude;
        if (mag > 0) { 
            this.x /= mag; 
            this.y /= mag; 
        }
        return this;
    }
}