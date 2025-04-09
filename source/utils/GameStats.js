// Score, Level, Fish count management
export class GameStats {
  constructor(gameScene) {
    this.gameScene = gameScene;
    this.reset();
  }
  
    reset() {
      this.score = 0;
      this.level = 1;
      this.fishEaten = 0;
      this.smallerCount = 0;
      this.updateUI();
    }
  
    addScore(amount) {
      if (this.gameScene.isGameOver) return;
      this.score += amount;
      this.fishEaten++;
      this.updateUI();
    }
  
    nextLevel() {
      this.level++;
      this.fishEaten = 0;
      this.updateUI();
    }
  
    updateUI() {
      const scoreEl = document.getElementById('score');
      const levelEl = document.getElementById('level');
      const fishEl = document.getElementById('fishCount');
  
      if (scoreEl) scoreEl.textContent = this.score;
      if (levelEl) levelEl.textContent = this.level;
      if (fishEl) fishEl.textContent = this.fishEaten;
    }
  }
  