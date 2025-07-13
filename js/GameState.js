import { GAME_CONSTANTS } from './constants.js';

// ゲーム状態管理クラス
export class GameState {
    constructor() {
        this.state = 'START'; // START, PLAYING, GAMEOVER
        this.score = 0;
        this.highScore = 0;
        this.lives = GAME_CONSTANTS.GAME.INITIAL_LIVES;
        this.screenShake = { duration: 0, magnitude: 0 };
    }

    reset() {
        this.state = 'PLAYING';
        this.score = 0;
        this.lives = GAME_CONSTANTS.GAME.INITIAL_LIVES;
        this.screenShake = { duration: 0, magnitude: 0 };
    }

    addScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    loseLife() {
        this.lives--;
        return this.lives > 0;
    }

    loadHighScore() {
        try {
            const saved = localStorage.getItem(GAME_CONSTANTS.STORAGE_KEY);
            this.highScore = saved ? parseInt(saved, 10) : 0;
        } catch (error) {
            console.error('Failed to load high score:', error);
            this.highScore = 0;
        }
    }

    saveHighScore() {
        try {
            localStorage.setItem(GAME_CONSTANTS.STORAGE_KEY, this.highScore.toString());
        } catch (error) {
            console.error('Failed to save high score:', error);
        }
    }

    triggerScreenShake() {
        this.screenShake = {
            duration: GAME_CONSTANTS.GAME.SCREEN_SHAKE_DURATION,
            magnitude: GAME_CONSTANTS.GAME.SCREEN_SHAKE_MAGNITUDE
        };
    }

    updateScreenShake() {
        if (this.screenShake.duration > 0) {
            this.screenShake.duration--;
            return {
                x: (Math.random() - 0.5) * this.screenShake.magnitude,
                y: (Math.random() - 0.5) * this.screenShake.magnitude
            };
        }
        return { x: 0, y: 0 };
    }
}