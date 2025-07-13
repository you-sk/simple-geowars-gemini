import { GAME_CONSTANTS } from './constants.js';
import { GameState } from './GameState.js';
import { InputManager } from './InputManager.js';
import { EntityManager } from './EntityManager.js';
import { AudioManager } from './AudioManager.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';

// ゲームクラス
export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameState = new GameState();
        this.inputManager = new InputManager();
        this.entityManager = new EntityManager();
        this.audioManager = new AudioManager();
        this.player = null;
        this.enemySpawnTimer = 0;
        this.animationFrameId = null;
        
        this.setupUI();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    setupUI() {
        this.ui = {
            score: document.getElementById('score-container'),
            highScore: document.getElementById('highscore-container'),
            lives: document.getElementById('lives-container'),
            startScreen: document.getElementById('start-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            finalScore: document.getElementById('final-score'),
            volumeSlider: document.getElementById('volume-slider'),
            audioToggle: document.getElementById('audio-toggle')
        };
        
        // 音量コントロールの設定
        this.setupAudioControls();
    }

    setupAudioControls() {
        // 音量スライダー
        this.ui.volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audioManager.setVolume(volume);
        });
        
        // 音声ON/OFFトグル
        this.ui.audioToggle.addEventListener('click', () => {
            const enabled = this.audioManager.toggle();
            this.ui.audioToggle.textContent = enabled ? 'ON' : 'OFF';
            this.ui.audioToggle.classList.toggle('disabled', !enabled);
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.gameState.loadHighScore();
        this.updateUI();
        this.ui.startScreen.classList.remove('hidden');
        this.ui.gameOverScreen.classList.add('hidden');
        this.gameLoop();
    }

    start() {
        this.gameState.reset();
        this.entityManager.reset();
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.enemySpawnTimer = GAME_CONSTANTS.GAME.INITIAL_SPAWN_TIMER;
        
        // オーディオを有効化（ユーザー操作後）
        this.audioManager.enableAudio();
        this.audioManager.playGameStart();
        
        this.ui.startScreen.classList.add('hidden');
        this.ui.gameOverScreen.classList.add('hidden');
        this.updateUI();
    }

    updateUI() {
        this.ui.score.textContent = `SCORE: ${this.gameState.score}`;
        this.ui.highScore.textContent = `HI-SCORE: ${this.gameState.highScore}`;
        
        this.ui.lives.innerHTML = '';
        for (let i = 0; i < this.gameState.lives; i++) {
            const lifeIcon = document.createElement('div');
            lifeIcon.className = 'life-icon';
            this.ui.lives.appendChild(lifeIcon);
        }
    }

    handlePlayerDeath() {
        // 爆発エフェクト
        this.entityManager.createExplosion(
            this.player.x, this.player.y, 
            GAME_CONSTANTS.PLAYER.COLOR,
            {
                count: GAME_CONSTANTS.PARTICLE.PLAYER_DEATH_COUNT,
                speed: GAME_CONSTANTS.PARTICLE.PLAYER_DEATH_SPEED,
                sizeMin: 1,
                sizeRange: GAME_CONSTANTS.PARTICLE.PLAYER_DEATH_SIZE - 1,
                life: GAME_CONSTANTS.PARTICLE.PLAYER_DEATH_LIFE
            }
        );

        this.gameState.triggerScreenShake();
        this.entityManager.clearAllEnemies();
        this.audioManager.playPlayerHit();

        if (this.gameState.loseLife()) {
            this.player.respawn(this.canvas);
            this.updateUI();
        } else {
            this.gameOver();
        }
    }

    gameOver() {
        this.gameState.state = 'GAMEOVER';
        this.gameState.saveHighScore();
        this.audioManager.playGameOver();
        this.ui.finalScore.textContent = `YOUR SCORE: ${this.gameState.score}`;
        this.ui.gameOverScreen.classList.remove('hidden');
    }

    spawnEnemy() {
        this.enemySpawnTimer--;
        if (this.enemySpawnTimer <= 0) {
            const radius = Math.random() * 
                (GAME_CONSTANTS.ENEMY.MAX_RADIUS - GAME_CONSTANTS.ENEMY.MIN_RADIUS) + 
                GAME_CONSTANTS.ENEMY.MIN_RADIUS;
            
            let x, y;
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? -radius : this.canvas.width + radius;
                y = Math.random() * this.canvas.height;
            } else {
                x = Math.random() * this.canvas.width;
                y = Math.random() < 0.5 ? -radius : this.canvas.height + radius;
            }
            
            const color = GAME_CONSTANTS.ENEMY.COLORS[
                Math.floor(Math.random() * GAME_CONSTANTS.ENEMY.COLORS.length)
            ];
            const angle = Math.atan2(this.player.y - y, this.player.x - x);
            const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
            
            const type = Math.random() < GAME_CONSTANTS.ENEMY.WANDERER_SPAWN_CHANCE ? 
                'wanderer' : 'seeker';
            
            if (type === 'wanderer') {
                velocity.x *= GAME_CONSTANTS.ENEMY.WANDERER_SPEED_MULTIPLIER;
                velocity.y *= GAME_CONSTANTS.ENEMY.WANDERER_SPEED_MULTIPLIER;
            }
            
            this.entityManager.addEnemy(new Enemy(x, y, radius, color, velocity, type));
            
            this.enemySpawnTimer = Math.max(
                GAME_CONSTANTS.GAME.MIN_SPAWN_TIMER, 
                GAME_CONSTANTS.GAME.INITIAL_SPAWN_TIMER - 
                this.gameState.score / GAME_CONSTANTS.GAME.SPAWN_TIMER_SCORE_DIVISOR
            );
        }
    }

    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = "rgba(0, 255, 255, 0.1)"; 
        this.ctx.lineWidth = 1;
        const gridSize = GAME_CONSTANTS.GAME.GRID_SIZE;
        
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath(); 
            this.ctx.moveTo(x, 0); 
            this.ctx.lineTo(x, this.canvas.height); 
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath(); 
            this.ctx.moveTo(0, y); 
            this.ctx.lineTo(this.canvas.width, y); 
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    update() {
        if (this.gameState.state === 'PLAYING') {
            // プレイヤー更新
            this.player.update(this.inputManager, this.canvas);
            const projectile = this.player.tryShoot(this.inputManager);
            if (projectile) {
                this.audioManager.playPlayerShoot();
            }
            this.entityManager.addProjectile(projectile);

            // 敵スポーン
            this.spawnEnemy();

            // エンティティ更新
            this.entityManager.update(this.player, this.canvas);

            // 衝突判定
            const collisions = this.entityManager.checkCollisions(this.player, this.gameState);
            
            if (collisions.playerHit) {
                this.handlePlayerDeath();
            }

            collisions.enemiesKilled.forEach(({ enemy, projectile }) => {
                this.entityManager.createExplosion(
                    projectile.x, projectile.y, enemy.color,
                    {
                        count: enemy.radius * GAME_CONSTANTS.PARTICLE.ENEMY_DEATH_MULTIPLIER,
                        speed: GAME_CONSTANTS.PARTICLE.ENEMY_DEATH_SPEED,
                        sizeMin: GAME_CONSTANTS.PARTICLE.ENEMY_DEATH_SIZE_MIN,
                        sizeRange: GAME_CONSTANTS.PARTICLE.ENEMY_DEATH_SIZE_RANGE,
                        life: GAME_CONSTANTS.PARTICLE.ENEMY_DEATH_LIFE
                    }
                );
                this.audioManager.playEnemyDestroy();
                this.gameState.addScore(GAME_CONSTANTS.GAME.SCORE_PER_KILL);
                this.updateUI();
            });
        }
    }

    draw() {
        this.ctx.save();
        
        // 画面シェイク
        const shake = this.gameState.updateScreenShake();
        this.ctx.translate(shake.x, shake.y);

        // 背景
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();

        // ゲーム描画
        if (this.gameState.state === 'PLAYING') {
            this.player.draw(this.ctx);
            this.entityManager.draw(this.ctx);
        }

        this.ctx.restore();
    }

    gameLoop() {
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());

        // 開始入力チェック
        if (this.gameState.state !== 'PLAYING' && this.inputManager.isStartPressed()) {
            this.start();
        }

        this.update();
        this.draw();
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}