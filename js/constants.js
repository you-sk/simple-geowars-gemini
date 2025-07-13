// ゲーム定数定義
export const GAME_CONSTANTS = {
    PLAYER: {
        RADIUS: 15,
        SPEED: 5,
        SHOOT_COOLDOWN: 5,
        INVINCIBILITY_FRAMES: 180,
        COLOR: 'white'
    },
    PROJECTILE: {
        RADIUS: 5,
        SPEED: 7,
        COLOR: 'cyan'
    },
    ENEMY: {
        MIN_RADIUS: 10,
        MAX_RADIUS: 30,
        BASE_SPEED: 2,
        WANDERER_SPEED_MULTIPLIER: 0.5,
        WANDERER_SPAWN_CHANCE: 0.2,
        COLORS: ['#ff00ff', '#ff9900', '#ffff00', '#00ff00']
    },
    PARTICLE: {
        PLAYER_DEATH_COUNT: 80,
        PLAYER_DEATH_SPEED: 10,
        PLAYER_DEATH_SIZE: 4,
        PLAYER_DEATH_LIFE: 60,
        ENEMY_DEATH_MULTIPLIER: 1.5,
        ENEMY_DEATH_SPEED: 5,
        ENEMY_DEATH_SIZE_MIN: 1,
        ENEMY_DEATH_SIZE_RANGE: 1,
        ENEMY_DEATH_LIFE: 30
    },
    GAME: {
        INITIAL_LIVES: 3,
        INITIAL_SPAWN_TIMER: 100,
        MIN_SPAWN_TIMER: 20,
        SPAWN_TIMER_SCORE_DIVISOR: 100,
        SCORE_PER_KILL: 100,
        SCREEN_SHAKE_DURATION: 20,
        SCREEN_SHAKE_MAGNITUDE: 15,
        GRID_SIZE: 50,
        GAMEPAD_DEADZONE: 0.25
    },
    STORAGE_KEY: 'twinStickHighScore'
};