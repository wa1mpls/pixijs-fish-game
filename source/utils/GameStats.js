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
  
    // Update UI ngay lập tức
    this.updateUI();
  }
  
  addScore(amount) {
    if (this.gameScene.isGameOver || !this.gameScene.isInGame) return;
    this.score += amount;
    this.updateUI(); // chỉ update điểm
  }
    
  registerFishEaten() {
    if (this.gameScene.isGameOver || !this.gameScene.isInGame) return;
    this.fishEaten++;
    this.updateUI();
  }
    
  nextLevel() {
    if (this.gameScene.isGameOver || !this.gameScene.isInGame) return;
    this.level++;
    this.fishEaten = 0;
    this.updateUI();
  }
  
  updateUI() {
    if (this.gameScene.isGameOver || !this.gameScene.isInGame) return; // Không cập nhật UI nếu không trong game
    
    const scoreEl = document.getElementById('score');
    const levelEl = document.getElementById('level');        // Game level
    const sizeLevelEl = document.getElementById('sizeLevel'); // Size level
    const fishEl = document.getElementById('fishCount');
    
    if (scoreEl) scoreEl.textContent = this.score;
    if (levelEl) levelEl.textContent = ` ${this.level}`;
    if (sizeLevelEl && this.gameScene.player) {
      sizeLevelEl.textContent = ` ${this.gameScene.player.level}`;
    }
    if (fishEl) fishEl.textContent = this.fishEaten;
  }
}
  