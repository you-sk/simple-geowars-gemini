// オーディオマネージャークラス
export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.3;
        this.enabled = true;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.enabled = false;
        }
    }

    // AudioContextを有効化（ユーザー操作後に必要）
    enableAudio() {
        if (!this.enabled || !this.audioContext) return;
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // 基本的なビープ音を生成
    createBeep(frequency, duration, volume = 1) {
        if (!this.enabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = 'square';
            
            const adjustedVolume = volume * this.masterVolume;
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(adjustedVolume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }

    // 複数の周波数を同時に再生（和音効果）
    createChord(frequencies, duration, volume = 1) {
        frequencies.forEach(freq => {
            this.createBeep(freq, duration, volume / frequencies.length);
        });
    }

    // ノイズ音を生成
    createNoise(duration, volume = 1) {
        if (!this.enabled || !this.audioContext) return;

        try {
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.1;
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            const adjustedVolume = volume * this.masterVolume;
            gainNode.gain.setValueAtTime(adjustedVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            source.start(this.audioContext.currentTime);
        } catch (error) {
            console.warn('Noise generation failed:', error);
        }
    }

    // ゲーム効果音定義
    playEnemyDestroy() {
        // 敵破壊音：高音から低音へのスイープ
        const frequencies = [800, 600, 400, 200];
        const duration = 0.1;
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createBeep(freq, duration, 0.8);
            }, index * 30);
        });
    }

    playPlayerShoot() {
        // 弾丸発射音：短い高音
        this.createBeep(1200, 0.05, 0.4);
    }

    playPlayerHit() {
        // プレイヤー被弾音：低音のノイズ
        this.createNoise(0.3, 0.8);
        this.createBeep(150, 0.3, 0.6);
    }

    playGameStart() {
        // ゲーム開始音：上昇する音階
        const notes = [261, 329, 392, 523]; // C, E, G, C
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.createBeep(freq, 0.2, 0.6);
            }, index * 100);
        });
    }

    playGameOver() {
        // ゲームオーバー音：下降する音階
        const notes = [523, 392, 329, 261]; // C, G, E, C
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.createBeep(freq, 0.4, 0.7);
            }, index * 200);
        });
    }

    playPowerUp() {
        // パワーアップ音：和音
        this.createChord([523, 659, 784], 0.3, 0.8);
    }

    // 音量設定
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    // 音響の有効/無効切り替え
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // オーディオコンテキストの状態を取得
    getStatus() {
        if (!this.audioContext) return 'not_supported';
        return {
            state: this.audioContext.state,
            enabled: this.enabled,
            volume: this.masterVolume
        };
    }
}