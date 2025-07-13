import { GAME_CONSTANTS } from './constants.js';
import { Particle } from './entities/Particle.js';

// エンティティマネージャークラス
export class EntityManager {
    constructor() {
        this.projectiles = [];
        this.enemies = [];
        this.particles = [];
    }

    reset() {
        this.projectiles = [];
        this.enemies = [];
        this.particles = [];
    }

    addProjectile(projectile) {
        if (projectile) this.projectiles.push(projectile);
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    addParticle(particle) {
        this.particles.push(particle);
    }

    createExplosion(x, y, color, config) {
        for (let i = 0; i < config.count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * config.speed;
            this.addParticle(new Particle(
                x, y, color,
                { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
                Math.random() * config.sizeRange + config.sizeMin,
                config.life
            ));
        }
    }

    update(player, canvas) {
        // パーティクル更新
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.isAlive();
        });

        // 弾丸更新
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update();
            return !projectile.isOutOfBounds(canvas);
        });

        // 敵更新
        this.enemies.forEach(enemy => enemy.update(player));
    }

    checkCollisions(player, gameState) {
        const collisions = { playerHit: false, enemiesKilled: [] };

        // プレイヤーと敵の衝突
        if (!player.isInvincible) {
            this.enemies.forEach((enemy, index) => {
                if (enemy.checkCollision(player)) {
                    collisions.playerHit = true;
                }
            });
        }

        // 弾丸と敵の衝突
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                if (this.enemies[j].checkCollision(this.projectiles[i])) {
                    collisions.enemiesKilled.push({
                        enemy: this.enemies[j],
                        projectile: this.projectiles[i]
                    });
                    this.enemies.splice(j, 1);
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
        }

        return collisions;
    }

    clearAllEnemies() {
        this.enemies.forEach(enemy => {
            this.createExplosion(enemy.x, enemy.y, enemy.color, {
                count: enemy.radius * GAME_CONSTANTS.PARTICLE.ENEMY_DEATH_MULTIPLIER,
                speed: GAME_CONSTANTS.PARTICLE.ENEMY_DEATH_SPEED,
                sizeMin: GAME_CONSTANTS.PARTICLE.ENEMY_DEATH_SIZE_MIN,
                sizeRange: GAME_CONSTANTS.PARTICLE.ENEMY_DEATH_SIZE_RANGE,
                life: GAME_CONSTANTS.PARTICLE.ENEMY_DEATH_LIFE
            });
        });
        this.enemies = [];
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
        this.projectiles.forEach(p => p.draw(ctx));
        this.enemies.forEach(e => e.draw(ctx));
    }
}