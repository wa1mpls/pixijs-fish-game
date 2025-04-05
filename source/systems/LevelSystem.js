import { GameStats } from '../utils/GameStats.js';

export class LevelSystem {
  constructor(gameScene, player, stats) {
    this.game = gameScene;
    this.player = player;
    this.stats = stats;
    this.requiredFish = 100;
    this.maxLevel = 3;
    this.levelSpeedMultiplier = 1.5;
    
  }

  update() {
    if (this.stats.fishEaten >= this.requiredFish) {
      this.nextLevel();
    }
  }

  nextLevel() {
    if (this.stats.level >= this.maxLevel) {
      this.endGame(true); // win
      return;
    }

    this.stats.nextLevel();

    // Tăng tốc game
    const oldSpeed = PIXI.Ticker.shared.speed;
    PIXI.Ticker.shared.speed = oldSpeed * this.levelSpeedMultiplier;

    // Reset cá, sinh thêm enemy mới
    this.game.resetSceneForNextLevel();
  }

  endGame(won) {
    PIXI.Ticker.shared.stop();
    alert(won ? '🎉 You Win!' : '💀 Game Over');
    window.location.reload(); // hoặc chuyển về menu
  }
}
