import { GameStats } from '../utils/GameStats.js';

export class LevelSystem {
  constructor(game, player, stats) {
    this.game = game;
    this.player = player;
    this.stats = stats;
    this.requiredFish = 45;
    this.maxLevel = 3;
    this.levelSpeedMultiplier = 1.5;
    
  }

  update() {
    if (this.game.isGameOver || !this.game.isInGame) return;
    
    if (this.stats.fishEaten >= this.stats.fishNeededForNextLevel) {
      this.stats.level++;
      
      this.player.grow();
      
      if (this.stats.level >= this.maxLevel) {
        this.game.showWinScreen();
        return;
      }
      
      this.game.showLevelUpText(this.stats.level);
      
      this.stats.fishNeededForNextLevel = this.stats.level * 5;
    }
  }

  nextLevel() {
    if (this.game.isGameOver || !this.game.isInGame) return;
    
    if (this.stats.level >= this.maxLevel) {
      this.endGame(true); // win
      return;
    }

    this.stats.nextLevel();
    this.game.showNextLevelText(this.stats.level);

    // Tăng tốc game
    const oldSpeed = PIXI.Ticker.shared.speed;
    PIXI.Ticker.shared.speed = oldSpeed * this.levelSpeedMultiplier;

    // Reset cá, sinh thêm enemy mới
    this.game.resetSceneForNextLevel();
  }

  endGame(won) {
    // Kiểm tra xem game đã kết thúc chưa
    if (this.game.isGameOver) {
      console.log("LevelSystem.endGame() - game already over");
      return;
    }
    
    console.log("LevelSystem.endGame() - Game " + (won ? "won" : "lost"));
    
    if (won) {
      // Đặt flag trạng thái
      this.game.isGameOver = true;
      this.game.isInGame = false;
      
      // Dừng game loop
      if (this.game.app.ticker.started) {
        this.game.app.ticker.stop();
      }
      
      // Remove update callback
      this.game.app.ticker.remove(this.game.update, this.game);
      
      // Remove event listeners
      this.game.app.stage.eventMode = 'none';
      this.game.app.stage.removeAllListeners();
      
      // Hide UI
      const ui = document.getElementById('ui');
      if (ui) ui.style.display = 'none';
      
      // Store score before we lose reference
      const finalScore = this.stats.score || 0;
      console.log("Win! Final score:", finalScore);
      
      // Clear the stage with a slight delay
      setTimeout(() => {
        // Destroy container but keep stage
        if (this.game.container) {
          this.game.container.destroy({ children: true, texture: true });
        }
        
        this.game.app.stage.removeChildren();
        
        // Load MenuScene
        import('../scene/MenuScene.js').then(module => {
          const menuScene = new module.MenuScene(this.game.app);
          menuScene.show();
        }).catch(error => {
          console.error("Error loading MenuScene:", error);
          alert("You Won! Your score: " + finalScore);
          window.location.reload();
        });
      }, 50);
    } else {
      // Thua: Gọi gameOver() của GameScene
      this.game.gameOver();
    }
  }
}
