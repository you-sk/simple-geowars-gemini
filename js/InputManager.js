import { GAME_CONSTANTS } from './constants.js';

// 入力管理クラス
export class InputManager {
    constructor() {
        this.keys = {
            w: false, a: false, s: false, d: false,
            ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
            Enter: false
        };
        this.gamepad = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = false;
        });
        window.addEventListener("gamepadconnected", (e) => {
            this.gamepad = e.gamepad;
            this.onGamepadConnected(e.gamepad);
        });
        window.addEventListener("gamepaddisconnected", () => {
            this.gamepad = null;
            this.onGamepadDisconnected();
        });
    }

    onGamepadConnected(gamepad) {
        const statusEl = document.getElementById('gamepad-status');
        statusEl.textContent = `ゲームパッド接続中: ${gamepad.id}`;
        statusEl.style.color = '#0ff';
    }

    onGamepadDisconnected() {
        const statusEl = document.getElementById('gamepad-status');
        statusEl.innerHTML = `キーボードで操作: WASDで移動, 矢印キーでショット<br>ゲームパッドを接続してください`;
        statusEl.style.color = 'rgba(255,255,255,0.5)';
    }

    getMovement() {
        let moveX = 0, moveY = 0;
        const deadzone = GAME_CONSTANTS.GAME.GAMEPAD_DEADZONE;
        
        if (this.gamepad) {
            const gp = navigator.getGamepads()[this.gamepad.index];
            if (gp) {
                const leftStickX = gp.axes[0];
                const leftStickY = gp.axes[1];
                if (Math.abs(leftStickX) > deadzone) moveX = leftStickX;
                if (Math.abs(leftStickY) > deadzone) moveY = leftStickY;
            }
        }
        
        if (moveX === 0 && moveY === 0) {
            if (this.keys.w) moveY -= 1;
            if (this.keys.s) moveY += 1;
            if (this.keys.a) moveX -= 1;
            if (this.keys.d) moveX += 1;
        }
        
        return { x: moveX, y: moveY };
    }

    getShooting() {
        let shootX = 0, shootY = 0;
        const deadzone = GAME_CONSTANTS.GAME.GAMEPAD_DEADZONE;
        
        if (this.gamepad) {
            const gp = navigator.getGamepads()[this.gamepad.index];
            if (gp) {
                const rightStickX = gp.axes[2];
                const rightStickY = gp.axes[3];
                if (Math.abs(rightStickX) > deadzone) shootX = rightStickX;
                if (Math.abs(rightStickY) > deadzone) shootY = rightStickY;
            }
        }
        
        if (shootX === 0 && shootY === 0) {
            if (this.keys.ArrowUp) shootY -= 1;
            if (this.keys.ArrowDown) shootY += 1;
            if (this.keys.ArrowLeft) shootX -= 1;
            if (this.keys.ArrowRight) shootX += 1;
        }
        
        return { x: shootX, y: shootY };
    }

    isStartPressed() {
        let pressed = this.keys.Enter;
        if (this.gamepad) {
            const gp = navigator.getGamepads()[this.gamepad.index];
            if (gp && (gp.buttons[9].pressed || gp.buttons[0].pressed)) {
                pressed = true;
            }
        }
        return pressed;
    }
}